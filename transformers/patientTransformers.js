const transformPatientData = (patientData) => {
  let patient_data;

  patientData = JSON.parse(JSON.stringify(patientData));

  let attachments = [];

  for (let attachment of patientData?.patients_attachments) {
    attachments.push({
      id: attachment?.id,
      attachment_url: attachment?.attachment_url,
    });
  }

  patient_data = {
    id: patientData?.id,
    name: patientData?.name,
    mobile: patientData?.mobile,
    user_id: patientData?.user_id,
    patient_uuid: patientData?.patients_attachments[0]?.patient_uuid,
    attachments: attachments,
  };

  return patient_data;
};

module.exports = { transformPatientData };
