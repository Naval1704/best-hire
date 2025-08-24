import { Card, Row, Col, Select, Input, Button, Space, Typography, Switch } from "antd";
import { SearchOutlined, FilterOutlined, ReloadOutlined, StarFilled } from "@ant-design/icons";

const { Option } = Select;
const { Text } = Typography;

function FilterPanel({
  locationFilter,
  availabilityFilter,
  skillFilter,
  experienceSearch,
  uniqueLocations,
  uniqueAvailabilities,
  uniqueSkills,
  setLocationFilter,
  setAvailabilityFilter,
  setSkillFilter,
  setExperienceSearch,
  resetFilters,
  showOnlyTop,
  setShowOnlyTop,
}) {
  return (
    <Card
      title={
        <Space>
          <FilterOutlined /> Filters
        </Space>
      }
      style={{ marginBottom: 20 }}
    >
      <Row gutter={[16, 16]}>
        {/* Location filter */}
        <Col span={6}>
          <Select
            placeholder="Select Location"
            style={{ width: "100%" }}
            value={locationFilter}
            onChange={setLocationFilter}
            allowClear
          >
            {uniqueLocations.map((loc) => (
              <Option key={loc} value={loc}>
                {loc}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Availability filter */}
        <Col span={6}>
          <Select
            placeholder="Select Availability"
            style={{ width: "100%" }}
            value={availabilityFilter}
            onChange={setAvailabilityFilter}
            allowClear
          >
            {uniqueAvailabilities.map((avail) => (
              <Option key={avail} value={avail}>
                {avail}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Skill filter */}
        <Col span={6}>
          <Select
            mode="multiple"
            placeholder="Select Skill"
            style={{ width: "100%" }}
            value={skillFilter}
            onChange={(values) => setSkillFilter(values)}
            allowClear
          >
            {uniqueSkills.map((skill) => (
              <Option key={skill} value={skill}>
                {skill}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Experience search */}
        <Col span={6}>
          <Input
            placeholder="Search Experience"
            prefix={<SearchOutlined />}
            value={experienceSearch}
            onChange={(e) => setExperienceSearch(e.target.value)}
          />
        </Col>
      </Row>

      <Row justify="space-between" align="middle" style={{ marginTop: 16 }}>
        <Col>
          <Button icon={<ReloadOutlined />} onClick={resetFilters}>
            Reset Filters
          </Button>
        </Col>

        {/* New Toggle for Top 5 */}
        <Col>
          <Space>
            <StarFilled style={{ color: "#faad14" }} />
            <Text strong>Show Top 5 Hires</Text>
            <Switch
              checked={showOnlyTop}
              onChange={(checked) => setShowOnlyTop(checked)}
            />
          </Space>
        </Col>
      </Row>
    </Card>
  );
}

export default FilterPanel;
