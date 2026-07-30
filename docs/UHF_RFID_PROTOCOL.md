UHF RFID Reader Communication Protocol

Applicable Models: All CPH UHF RFID Readers
Version: 4.0.1
Date: 2019-07-02

1. Frame Format Definition

All interactions between the host and the RFID reader are transmitted in data frame units.

+----------+------------+---------+------------+--------------+------------+----------+
|  Header  | Frame Type | Address | Frame Code | Param Length | Parameters | Checksum |
+----------+------------+---------+------------+--------------+------------+----------+
| 'R'  'F' |   1 Byte   | 2 Bytes |   1 Byte   |   2 Bytes    |  N Bytes   |  1 Byte  |
|          |            | MSB LSB |            |   MSB  LSB   |  (TLV)     |          |
+----------+------------+---------+------------+--------------+------------+----------+


1.1. Frame Fields

Header: Original mark of the data frame, consisting of characters 'R' and 'F' (0x52, 0x46).

Frame Type: Indicates the direction and purpose of the frame:

0x00 (Command Frame): Sent by the upper control device (host) to control reading/writing, query/set parameters, etc.

0x01 (Response Frame): Sent by the RFID reader as an execution result response to a host command.

0x02 (Notification Frame): Actively sent by the RFID reader without a host command (e.g., uploading read tag data in active reading mode).

Address: Device address (2 Bytes, MSB first, LSB second). The reader only responds if its address matches the frame's address.

Frame Code: Identifies the command executed or the command being responded to.

Param Length: Length of the Parameters field in bytes (2 Bytes, MSB first, LSB second).

Parameters: Encoded in TLV (Tag, Length, Value) format. TLVs can be nested.

Checksum: Calculates data integrity from the Header to the end of the byte preceding the Checksum. Frames with invalid checksums are discarded.

2. Checksum Calculation

The checksum is calculated by summing all bytes from the Header up to the byte before Checksum, taking the bitwise complement, and adding 1 (Two's Complement).

RFID_UINT8 caculate_checksum(RFID_UINT8 *buff_ptr, RFID_UINT8 len)
{
    RFID_UINT8 index = 0;
    RFID_UINT8 check_sum = 0;
    for (index = 0; index < len; index++)
    {
        check_sum += buff_ptr[index];
    }
    check_sum = ~check_sum + 1;
    return check_sum;
}


3. Command & Response Frames

3.1. Query Device Software Version & Info

Frame Code: 0x40

Host -> Reader (Command):

52 46 00 00 00 40 00 00 28

Reader -> Host (Response Example):

52 46 01 00 00 40 00 0B 07 01 00 20 03 04 00 01 21 01 05 C5

(Returns Status TLV, Software Version TLV, and Device Type TLV)

3.2. Start Inventory Tags

Continuously reads tags until a Stop command is received.

Frame Code: 0x21

Host -> Reader (Command):

52 46 00 00 00 21 00 00 47

Reader -> Host (Response):

52 46 01 00 00 21 00 03 07 01 00 3B

3.3. Active Inventory Tags

Triggers a single-shot read operation; stops automatically after reading/saving.

Frame Code: 0x22

Host -> Reader (Command):

52 46 00 00 00 22 00 00 46

Reader -> Host (Response):

Refer to Section 4 (Notification Frame - Tags Uploaded) for the response data format.

3.4. Stop Inventory Tags

Stops the reader from reading tags.

Frame Code: 0x23

Host -> Reader (Command):

52 46 00 00 00 23 00 00 45

Reader -> Host (Response):

52 46 01 00 00 23 00 03 07 01 00 39

3.5. Set Single Parameter

Frame Code: 0x48

Host -> Reader (Command Example - Set Power to 25 dBm / 2500 / 0x09C4):

52 46 00 00 00 48 00 05 26 03 01 09 C4 24

26 03 01 09 C4 -> TLV Type 0x26 (Single Parameter), Length 0x03, Type 0x01 (Power), Value 0x09C4.

Reader -> Host (Response):

52 46 01 00 00 48 00 03 07 01 00 [Checksum]

3.6. Query Single Parameter

Frame Code: 0x49

Host -> Reader (Command Example - Query Power):

52 46 00 00 00 49 00 03 26 01 01 F4

Reader -> Host (Response Example):

52 46 00 00 00 49 00 08 07 01 00 26 03 01 09 C4 18

(Returns Status TLV and Single Parameter TLV)

3.7. Restart Device

Frame Code: 0x10

Host -> Reader (Command):

52 46 00 00 00 10 00 00 58

Reader -> Host (Response):

52 46 01 00 00 10 00 03 07 01 00 4C

4. Notification Frames (Active Uploads)

4.1. Tags Uploaded

Sent actively by the reader when tag data is read.

Frame Type: 0x02

Frame Code: 0x80

Example Received Data:

52 46 02 00 00 80 00 19 50 17 01 0C E2 00 00 17 02 17 01 99 23 90 21 7D 05 01 C3 06 04 3D 00 00 00 4C

50: Single Tag TLV (Length 0x17)

01 0C E2 00 ... 21 7D: EPC TLV (0x01 = EPC Type, 0x0C = 12 Bytes Length, Value = E2...7D)

05 01 C3: RSSI TLV (0x05 = RSSI Type, Value = 0xC3)

06 04 3D 00 00 00: Time TLV

5. TLV Attribute Definitions

Data parameters are structured in Tag - Length - Value (TLV) formats.

TLV Name

Tag (Type)

Length

Value Description

Status

0x07

0x01

Status Code (See Section 5.1)

Software Version

0x20

0x03

Main, Sub, Modify Version (e.g., 04 00 01 = 4.0.1)

Device Type

0x21

0x03

1 Byte Device Type value

Single Parameter

0x26

Variable

Parameter Type + Parameter Value (See Section 5.2)

EPC

0x01

Variable

EPC Data bytes

RSSI

0x05

0x01

Signal strength indicator byte

Time

0x06

0x04

4 Bytes Timestamp

Single Tag (Nested)

0x50

Variable

Contains nested TLVs: [EPC TLV] [RSSI TLV] [Time TLV] [TID TLV]...

5.1. Status Codes (0x07)

Value

Name

Description

0x00

SUCCESS

Command completed successfully

0x14

Parameter unsupport

Unsupported parameter

0x15

Parameter len error

Parameter length incorrectly filled out

0x16

Parameter context error

Parameter content incorrectly filled out

0x17

Unsupport command

Command not supported

0x18

Device Address error

Device address does not match

0x20

Check Sum error

Checksum verification failed

0x21

Unsupport TLV Type

Internal reader error

0x22

Flash Error

Error writing flash when storing parameters

0xFF

Internal Error

Generic internal error

5.2. Single Parameter Types (0x26)

Type

Value Size

Description & Examples

0x01

2 Bytes (MSB LSB)

Power: Max value 3000 (0x0BB8), representing 30 dBm.



Example: 52 46 ... 26 03 01 09 C4 ... (Set to 2500 / 25 dBm)

0x02

1 Byte

Buzzer: 0x00 = Turn Off, 0x01 = Turn On.



Example: 52 46 ... 26 02 02 01 ...

0x03

1 Byte

Label Filtering Time: 1 ~ 255 (Unit: Seconds)

0x04

4 Bytes

Modem Data (Mixer Gain, IF AMP Gain, Threshold MSB/LSB):



- Mixer Gain: Default 9 (0x09)



- IF AMP Gain: Default 36 (0x24)



- Threshold: Default 0x00A0 (Higher value = closer reading distance)



Example: 52 46 ... 26 05 04 09 24 00 A0 ...