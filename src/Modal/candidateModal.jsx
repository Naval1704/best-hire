import { Modal, Descriptions, Tag, Timeline } from "antd";

function CandidateModal({ visible, candidate, onClose }) {
  return (
    <Modal
      title={
        <span style={{ fontWeight: "600", fontSize: "18px" }}>
          Candidate Profile
        </span>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 30 }}
    >
      {candidate && (
        <Descriptions
          bordered
          column={1}
          size="middle"
          labelStyle={{
            fontWeight: "600",
            background: "#f0f2f5",
            width: "200px",
          }}
          contentStyle={{ background: "white" }}
        >
          <Descriptions.Item label="Name">{candidate.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{candidate.email}</Descriptions.Item>
          <Descriptions.Item label="Location">{candidate.location}</Descriptions.Item>
          <Descriptions.Item label="Availability">
            {candidate.work_availability?.map((a) => (
              <Tag color="blue" style={{ borderRadius: "6px" }} key={a}>
                {a}
              </Tag>
            ))}
          </Descriptions.Item>
          <Descriptions.Item label="Salary Expectation">
            <span style={{ color: "#1677ff", fontWeight: "500" }}>
              {candidate.annual_salary_expectation?.["full-time"] ?? "N/A"}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Skills">
            {candidate.skills?.map((s) => (
              <Tag color="green" style={{ borderRadius: "6px" }} key={s}>
                {s}
              </Tag>
            ))}
          </Descriptions.Item>
          <Descriptions.Item label="Work Experience">
            {candidate.work_experiences?.length > 0 ? (
              <Timeline
                items={candidate.work_experiences.map((exp, idx) => ({
                  key: idx,
                  children: (
                    <div style={{ marginBottom: "8px" }}>
                      <strong>{exp.roleName}</strong> @ {exp.company}
                      <br />
                      <span style={{ color: "#888", fontSize: "13px" }}>
                        {exp.startDate} - {exp.endDate || "Present"}
                      </span>
                      {exp.description && (
                        <div style={{ marginTop: "4px", color: "#555" }}>
                          {exp.description}
                        </div>
                      )}
                    </div>
                  ),
                }))}
              />
            ) : (
              <span style={{ color: "#999" }}>Not provided</span>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Education">
            {candidate.education?.degrees?.length > 0 ? (
              <>
                {candidate.education.degrees.map((d, i) => (
                  <div key={i} style={{ marginBottom: "12px" }}>
                    <strong>{d.degree}</strong> in {d.subject}
                    <br />
                    <span style={{ color: "#888" }}>{d.school}</span>
                  </div>
                ))}
              </>
            ) : (
              <span style={{ color: "#999" }}>Not provided</span>
            )}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}

export default CandidateModal;
