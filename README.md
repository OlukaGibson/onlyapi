These instruction are to help run it locally
Install nodejs
cmd
npm install
npx hardhat run --network sepolia scripts/deploy.js

//this will be the sample json for data entry

{
  "code": "HR005",
  "diagnosis": {
    "comment": "sample",
    "diagnosis": "sample",
    "evidence": "kg24mecqnr3rdj3nsfyrkdg1jn6tdgjr",
    "healthRecordId": "js74rq72saf8g057t2m09tzmms6t5xb0",
    "medication": "sample",
    "staffId": "j97cxf3j8tew2h30v4txmw83bn6szjdq",
    "staffName": "Ziggy Inhos",
    "treatment": "sample",
    "_creationTime": 1717467574707.0503,
    "_id": "k17f3erdt3c5wbv9ekjzxcg14s6tcr71"
  },
  "examination": {
    "abdominalAuscaltation": "Reduced sounds",
    "auscaltationComments": "none",
    "bloodPressure": "189/54",
    "bodyTemperature": 238,
    "heartAuscaltation": "Murmurs",
    "height": 299,
    "lungAuscaltation": "Crackles",
    "organizationId": "org_2h670gdMkQcNrPdTalkmEwQrj8Q",
    "palpationInspection": "none",
    "patientComplaint": "none",
    "patientId": "jn7cjhrdntm1sv2x9g1dddx0tx6snx5w",
    "performedTests": ["Blood test", "Urine test"],
    "physicalInspection": "none",
    "respiratoryRate": 3288,
    "staffId": "j97cxf3j8tew2h30v4txmw83bn6szjdq",
    "staffName": "Ziggy Inhos",
    "weight": 388,
    "_creationTime": 1717170792900.4426,
    "_id": "k570bq7hj5ff1tna5zkqv6vq956t429p"
  },
  "organizationId": "org_2h670gdMkQcNrPdTalkmEwQrj8Q",
  "patientId": "jn7cjhrdntm1sv2x9g1dddx0tx6snx5w",
  "_creationTime": 1717170792900.4429,
  "_id": "js74rq72saf8g057t2m09tzmms6t5xb0"
}
node index.js