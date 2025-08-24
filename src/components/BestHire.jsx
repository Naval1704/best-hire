import { useState, useEffect } from "react";
import {
    Table,
    Tag,
    Spin,
    Alert,
    Typography,
    Button,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";

import CandidateModal from "../Modal/candidateModal";
import { filterCandidates } from "../utils/filters";
import FilterPanel from "../cards/filterCards";

const { Title } = Typography;

function BestHire() {
    // State
    const [candidates, setCandidates] = useState([]);
    const [filteredCandidates, setFilteredCandidates] = useState([]);

    // Loading and Error States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Selected Candidate
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    // Modal
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Filters
    const [locationFilter, setLocationFilter] = useState([]);
    const [availabilityFilter, setAvailabilityFilter] = useState([]);
    const [skillFilter, setSkillFilter] = useState([]);
    const [experienceSearch, setExperienceSearch] = useState("");

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Show Only Top 5
    const [showOnlyTop, setShowOnlyTop] = useState(false);

    // Fetch Candidates Data
    const get_candidates_data = async () => {
        try {
            setLoading(true);
            // Fetch candidates data from API
            // Put URL endpoint from ENV for best practice
            // const response = await fetch(
            //     process.env.CANDIDATE_DATA_URL
            // );
            const response = await fetch(
                "https://file.notion.so/f/f/f86ed84d-b33c-4dfb-b0e0-97c5661516a3/3ed586a1-78e7-46af-9cf1-0961f95b5109/form-submissions-1.json?table=block&id=2575392c-c93e-81c2-94b0-f93e6998cce9&spaceId=f86ed84d-b33c-4dfb-b0e0-97c5661516a3&expirationTimestamp=1756036872776&signature=OU0RKs7BSle5eClaEVQc-W1qmW8lxOcUtj4f1545TfM&downloadName=form-submissions.json"
            );
            if (!response.ok) throw new Error("Failed to fetch candidates");
            const data = await response.json();
            setCandidates(data);
            setFilteredCandidates(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        get_candidates_data();
    }, []);

    useEffect(() => {
        const filtered = filterCandidates(candidates, {
            locationFilter,
            availabilityFilter,
            skillFilter,
            experienceSearch,
        });
        setFilteredCandidates(filtered);
    }, [locationFilter, availabilityFilter, skillFilter, experienceSearch, candidates]);

    // Table Columns
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            fixed: "left",
            width: 120,
            render: (text) => (
                <span style={{ fontWeight: "600", color: "#1a1a1a" }}>{text}</span>
            ),
        },
        {
            title: "Location",
            dataIndex: "location",
            key: "location",
            width: 120,
            render: (loc) => <span style={{ color: "#555" }}>{loc}</span>,
        },
        {
            title: "Availability",
            dataIndex: "work_availability",
            key: "work_availability",
            width: 120,
            render: (availability) =>
                availability?.map((type) => (
                    <Tag
                        style={{ borderRadius: "8px", fontWeight: "500" }}
                        color="blue"
                        key={type}
                    >
                        {type}
                    </Tag>
                )),
        },
        {
            title: "Salary Expectation",
            dataIndex: "annual_salary_expectation",
            key: "annual_salary_expectation",
            width: 120,
            sorter: (a, b) => {
                const salaryA = Number(a.annual_salary_expectation?.["full-time"]?.replace(/[^0-9]/g, "")) || 0;
                const salaryB = Number(b.annual_salary_expectation?.["full-time"]?.replace(/[^0-9]/g, "")) || 0;
                return salaryA - salaryB;
            },
            render: (salary) => (
                <span style={{ fontWeight: "500", color: "#1677ff" }}>
                    {salary?.["full-time"] ?? "N/A"}
                </span>
            ),
        },
        {
            title: "Skills",
            dataIndex: "skills",
            key: "skills",
            width: 200,
            render: (skills) =>
                skills?.map((skill) => (
                    <Tag
                        style={{ borderRadius: "8px", fontWeight: "500" }}
                        color="green"
                        key={skill}
                    >
                        {skill}
                    </Tag>
                )) || <span style={{ color: "#999" }}>Not provided</span>,
        },
        {
            title: "Latest Experience",
            dataIndex: "work_experiences",
            key: "work_experiences",
            width: 250,
            render: (experiences) =>
                experiences?.length > 0 ? (
                    <>
                        <strong style={{ color: "#333" }}>
                            {experiences[0].roleName}
                        </strong>{" "}
                        <span style={{ color: "#888" }}>@ {experiences[0].company}</span>
                    </>
                ) : (
                    <span style={{ color: "#999" }}>Not provided</span>
                ),
        },
        {
            title: "Action",
            key: "action",
            fixed: "right",
            width: 60,
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => {
                        setSelectedCandidate(record);
                        setIsModalVisible(true);
                    }}
                    style={{
                        borderRadius: "8px",
                        fontWeight: "500",
                        color: "#1677ff",
                    }}
                />
            ),
        },
    ];

    // Loading
    if (loading) {
        return (
            <Spin
                tip="Loading candidates..."
                size="large"
                style={{ display: "block", margin: "80px auto" }}
            />
        );
    }

    // Error
    if (error) {
        return (
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                style={{ margin: "20px" }}
            />
        );
    }

    // Unique location options
    const uniqueLocations = [
        ...new Set(
            candidates.map((c) => c.location?.toLowerCase()).filter(Boolean)
        ),
    ];
    // Unique availability options
    const uniqueAvailabilities = [
        ...new Set(
            candidates.flatMap((c) =>
                c.work_availability?.map((a) => a.toLowerCase()) || []
            )
        ),
    ];
    // Unique skill options
    const uniqueSkills = [
        ...new Set(candidates.flatMap((c) => c.skills || [])),
    ];

    // Show Only Top 5
    const displayedCandidates = showOnlyTop
        ? filteredCandidates.slice(0, 5)
        : filteredCandidates;

    return (
        <div
            style={{
                padding: "32px",
                background: "linear-gradient(180deg, #f8f9fb, #eef1f6)",
                minHeight: "100vh",
                fontFamily: "Inter, sans-serif",
            }}
        >
            <Title
                level={2}
                style={{
                    textAlign: "center",
                    marginBottom: "32px",
                    fontWeight: "800",
                    fontSize: "26px",
                    color: "#1a1a1a",
                }}
            >
                BestHire - Find Your Next Great Hire!
            </Title>

            {/* Filters  */}
            <FilterPanel
                locationFilter={locationFilter}
                availabilityFilter={availabilityFilter}
                skillFilter={skillFilter}
                experienceSearch={experienceSearch}
                uniqueLocations={uniqueLocations}
                uniqueAvailabilities={uniqueAvailabilities}
                uniqueSkills={uniqueSkills}
                setLocationFilter={setLocationFilter}
                setAvailabilityFilter={setAvailabilityFilter}
                setSkillFilter={setSkillFilter}
                setExperienceSearch={setExperienceSearch}
                resetFilters={() => {
                    setLocationFilter([]);
                    setAvailabilityFilter([]);
                    setSkillFilter([]);
                    setExperienceSearch("");
                    setFilteredCandidates(candidates);
                }}
                setShowOnlyTop={setShowOnlyTop}
            />

            {/* Candidate Table */}
            <Table
                columns={columns}
                dataSource={displayedCandidates}
                rowKey="email"
                pagination={{
                    current: currentPage,
                    pageSize,
                    total: displayedCandidates.length,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} candidates`,
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    },
                }}
                scroll={{ x: 1100 }}
                bordered={false}
                style={{
                    background: "white",
                    borderRadius: "14px",
                    padding: "20px",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                }}
                rowClassName={() => "custom-row"}
            />

            {/* Candidate Modal */}
            <CandidateModal
                visible={isModalVisible}
                candidate={selectedCandidate}
                onClose={() => {
                    setSelectedCandidate(null);
                    setIsModalVisible(false);
                }}
            />
        </div>
    );
}

export default BestHire;
