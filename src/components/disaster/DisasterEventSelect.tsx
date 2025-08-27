export interface DisasterEvent {
  id: number;
  name?: string;
  locationName?: string;
  severity?: string;
  description?: string;
}

interface DisasterEventSelectProps {
  disasterEvents: DisasterEvent[];
  value: number | null;
  onChange: (val: number | null) => void;
}

export default function DisasterEventSelect({
  disasterEvents,
  value,
  onChange,
}: DisasterEventSelectProps) {
  return (
    <select
      name="DisasterEventId"
      value={value ?? ""}
      onChange={(e) => {
        const selectedId = e.target.value ? Number(e.target.value) : null;
        onChange(selectedId);
      }}
      className="border rounded p-2 w-full"
      style={{
        background: 'white'
      }}
    >
      <option
        value=""
        style={{
          padding: '8px 12px',
          backgroundColor: '#f8f9fa',
          color: '#6c757d',
          fontStyle: 'italic'
        }}
      >
        None
      </option>
      {disasterEvents.map((ev) => {
        const name = ev.name || "Unnamed";
        const location = ev.locationName || "N/A";
        const severity = ev.severity || "N/A";
        const description = ev.description ?? "N/A";
        const shortDescription =
          description.length > 10 ? `${description.slice(0, 10)}...` : description;

        return (
          <option
            key={ev.id}
            value={ev.id}
            style={{
              padding: '10px 12px',
              backgroundColor: 'white',
              borderBottom: '1px solid #e9ecef',
              color: '#212529',
              fontSize: '14px',
              lineHeight: '1.4'
            }}
          >
            {`📍 ${name} | 🌍 ${location} | ⚠️ ${severity} | 📝 ${shortDescription}`}
          </option>
        );
      })}
    </select>
  );
}
