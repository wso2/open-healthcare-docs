---
title: Upload Operations
sidebar_position: 6
---

# Upload Operations

`$upload` loads terminology content in bulk into the service from a zip archive, instead of creating `CodeSystem`/`ValueSet` resources one at a time. It supports plain FHIR resource bundles as well as native release formats for LOINC, SNOMED CT, and ICD-10-CM.

## $upload {#upload}

### Request

```bash
curl -X POST 'http://localhost:9090/fhir/r4/%24upload' \
  -H "Content-Type: application/zip" \
  -H "x-terminology-type: SNOMED" \
  --data-binary @snomed-ct-release.zip
```

Two things are required on the request:

| Requirement | Value |
|-------------|-------|
| `Content-Type` header | `application/zip` |
| `x-terminology-type` header | `FHIR`, `LOINC`, `SNOMED`, or `ICD10` |

The `x-terminology-type` header selects how the archive is interpreted. A missing or unrecognized value returns `400`.

### FHIR

Expects a zip of FHIR `CodeSystem-*.json` and `ValueSet-*.json` files. Loaded synchronously -- the response confirms the resources are already queryable.

### LOINC

Expects a LOINC release zip, as downloaded from loinc.org. Converted to a FHIR CodeSystem and loaded synchronously. The `LoincTable` folder must be present, containing `Loinc.csv` (the codes and their attributes). When the `AccessoryFiles/PartFile` folder is also included, its files are loaded too, and they supply the relationships between LOINC codes and their parts.

```text
Loinc_2.82.zip
└── Loinc_2.82/
    ├── LoincTable/
    │   ├── Loinc.csv                  ← required
    │   ├── MapTo.csv
    │   └── SourceOrganization.csv
    ├── AccessoryFiles/
    │   └── PartFile/                  ← used when present
    │       ├── Part.csv
    │       ├── LoincPartLink_Primary.csv
    │       ├── LoincPartLink_Supplementary.csv
    │       └── PartRelatedCodeMapping.csv
    ├── loinc.xml
    ├── LoincLicense_5.8.txt
    └── LoincReadMe.txt
```

A zip containing just the `LoincTable` folder at its root (`LoincTable/Loinc.csv`, `LoincTable/MapTo.csv`, …) is also accepted. Without the part files, however, the loaded CodeSystem has no relationship data: [`$lookup`](./codesystem-operations.md#lookup) returns no children, and any other operation that depends on relationships will not return results either.

| Query Parameter | Description |
|------------------|-------------|
| `loinc-version` | Optional. Version to record on the CodeSystem |

### SNOMED CT

Expects a SNOMED CT RF2 Snapshot release zip. The Concept, Description, Relationship and Text Definition files in the `Terminology` folder are all required. The `Refset` folder is read as well, so include it to load the reference sets (simple refsets, language, maps and so on) along with the concepts.

```text
SNOMED Snapshot.zip
└── Snapshot/
    ├── Terminology/
    │   ├── sct2_Concept_Snapshot_INT_20260401.txt          ← required
    │   ├── sct2_Description_Snapshot-en_INT_20260401.txt   ← required
    │   ├── sct2_Relationship_Snapshot_INT_20260401.txt     ← required
    │   ├── sct2_TextDefinition_Snapshot-en_INT_20260401.txt ← required
    │   └── …                                               (other RF2 files are not required)
    └── Refset/
        ├── Content/
        │   ├── der2_Refset_SimpleSnapshot_INT_20260401.txt
        │   ├── der2_cRefset_AssociationSnapshot_INT_20260401.txt
        │   └── der2_cRefset_AttributeValueSnapshot_INT_20260401.txt
        ├── Language/
        │   └── der2_cRefset_LanguageSnapshot-en_INT_20260401.txt
        ├── Map/
        │   ├── der2_sRefset_SimpleMapSnapshot_INT_20260401.txt
        │   └── der2_iisssccRefset_ExtendedMapSnapshot_INT_20260401.txt
        └── Metadata/
            └── …
```

File names carry the edition (`INT`) and release date (`20260401`), which differ between releases.

| Query Parameter | Description |
|------------------|-------------|
| `snomed-version` | Optional. RF2 release date as `YYYYMMDD`, recorded as the CodeSystem version |

### ICD-10-CM

Expects a zip of the ICD-10-CM release files: the tabular XML (`icd10cm-tabular_-<year>.xml`, for chapters and sections) and the order file (`icd10cm-order-<year>.txt`, for codes and descriptions). Files may be nested in subdirectories.

```text
icd10cm-upload.zip
└── icd10cm-upload/
    ├── icd10cm-tabular_-2027.xml      ← chapters and sections
    └── icd10cm-order-2027.txt         ← codes and descriptions
```

| Query Parameter | Description |
|------------------|-------------|
| `icd10cm-version` | Optional. Version to record on the CodeSystem |

The CodeSystem is loaded under `http://hl7.org/fhir/sid/icd-10-cm`. Only one ICD-10-CM import may run at a time (tracked independently of the SNOMED CT single-flight guard); a concurrent request returns `409`.

### Background Imports

**SNOMED CT and ICD-10-CM imports run in the background.** The request returns `201 Created` as soon as the archive is extracted, before concepts are loaded -- a full release takes several minutes. Check the server logs for progress and the completion summary.

Re-uploading the same url and version replaces the previous load rather than duplicating it. If an import fails partway through, the partial load is removed.

Concept hierarchy loaded this way is stored in a transitive is-a closure table, which backs [`$subsumes`](./codesystem-operations.md#subsumes) and the `is-a` / `descendent-of` filters on [`$expand`](./valueset-operations.md#expand).

## Related Topics

- [Terminology Overview](./overview.md)
- [CodeSystem Operations](./codesystem-operations.md)
- [ValueSet Operations](./valueset-operations.md)
