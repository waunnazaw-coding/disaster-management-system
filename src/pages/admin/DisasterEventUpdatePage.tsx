import { useParams, useNavigate } from "react-router-dom";
import DisasterEventUpdateForm from "./DisasterEventFormUpdate";

export default function DisasterEventUpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const eventId = Number(id);

  return (
    <DisasterEventUpdateForm
      eventId={eventId}
      onCancel={() => navigate(-1)}
      onSuccess={() => navigate(`/admin/events/${eventId}`)}
    />

  );
}
