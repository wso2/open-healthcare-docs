# Working with HL7 - Overview

HL7v2 is a messaging standard developed by Health Level Seven International (HL7) for the electronic interchange of clinical, financial, and administrative data. HL7v2 messages are used to communicate information between systems in healthcare organizations. HL7v2 messages are sent over a variety of transports MLLP, and HTTP.

HL7v2 messages are structured as a sequence of segments, where each segment contains one or more fields separated by delimiters. Each message type serves a specific purpose, such as patient admission, transfer, lab orders, etc. HL7v2 has several versions (e.g., v2.3, v2.5, v2.7), with v2.3 and v2.5 being the most widely adopted.

WSO2 Healthcare solution supports multiple HL7v2 versions, allowing integration with various healthcare systems. It offers message routing, transformation, and validation capabilities, ensuring that HL7v2 messages are accurately processed and delivered.

Follow the guides below to learn how to work with HL7 messages in WSO2 Healthcare solution:

  - [Populating HL7 messages](../../hl7/guides/populating-hl7-message.md)
  - [Parsing and Serializing](../../hl7/guides/parsing-and-serializing.md)
  - [Custom HL7 messages](../../hl7/guides/custom-hl7-message.md)
  - [Connect to HL7 TCP servers](../../hl7/guides/connect-to-hl7-tcp-servers.md)
  - [Connect to HL7 File servers](../../hl7/guides/connect-to-hl7-file-servers.md)
  - [HL7 server listener](../../hl7/guides/hl7-server-listener.md)
