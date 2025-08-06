// src/components/assignments/AssignmentDetailsModal.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import {
  MapPin,
  Phone,
  Mail,
  Users,
  ClipboardList,
  User,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";
import { AssignmentStatusBadge } from "./AssignmentStatusBadge";
import { RequestPriorityBadge } from "@/components/assistance_requests/RequestPriorityBadge";
import { Button } from "@/components/ui/button";
import { RequestAssignment } from "@/types/requestAssignments";
import { AssignmentStatusActions } from "./AssignmentStatusActions";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";

interface DetailSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

const DetailSection = ({
  icon,
  title,
  children,
  className,
  defaultOpen = true
}: DetailSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={className}>
      <button
        className="flex items-center justify-between w-full group py-3 px-1 hover:bg-gray-100/40 rounded transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          <span className={`text-blue-500 ${isOpen ? "text-blue-600" : ""}`}>
            {icon}
          </span>
          <h3
            className={`font-medium text-md ${
              isOpen ? "text-blue-700" : "text-gray-800"
            } group-hover:text-blue-700 transition-colors`}
          >
            {title}
          </h3>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="pl-8 pb-3 space-y-3">{children}</div>
      </div>
    </div>
  );
};

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

const DetailItem = ({ label, value, icon }: DetailItemProps) => (
  <div className="grid grid-cols-4 gap-4 items-start">
    <div className="col-span-1 flex items-start space-x-2">
      {icon && <span className="text-gray-500 mt-0.5">{icon}</span>}
      <p className="text-sm text-gray-500">{label}</p>
    </div>
    <div className="col-span-3">
      {typeof value === "string" || typeof value === "number" ? (
        <p className="text-sm text-gray-900">{value}</p>
      ) : (
        value
      )}
    </div>
  </div>
);

interface AssignmentDetailsModalProps {
  assignment: RequestAssignment | null;
  onClose: () => void;
  onStatusChange?: (id: number, status: string) => Promise<void>;
  isActive?: boolean;
}

export const AssignmentDetailsModal = ({
  assignment,
  onClose,
  onStatusChange,
  isActive = false
}: AssignmentDetailsModalProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showBottomFade, setShowBottomFade] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        setShowBottomFade(scrollTop + clientHeight < scrollHeight - 10);
      }
    };

    const currentRef = contentRef.current;
    currentRef?.addEventListener("scroll", checkScroll);
    checkScroll();

    return () => {
      currentRef?.removeEventListener("scroll", checkScroll);
    };
  }, [assignment]);

  if (!assignment) return null;

  return (
    <Card
      className={`h-full flex flex-col border rounded-xl shadow-md transition-all duration-300 overflow-hidden ${
        isActive ? "border-blue-300 bg-white" : "border-gray-200"
      }`}
    >
      <CardHeader
        className={`border-b px-6 py-4 ${
          isActive ? "border-blue-200 bg-blue-50/40" : "border-gray-100 bg-gray-50/40"
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList
                className={`h-5 w-5 ${
                  isActive ? "text-blue-600" : "text-blue-500"
                }`}
              />
              <span
                className={`text-lg font-semibold ${
                  isActive ? "text-blue-700" : "text-gray-900"
                }`}
              >
                Assignment Details
              </span>
            </CardTitle>
            <p
              className={`text-sm mt-1 ${
                isActive ? "text-blue-600" : "text-gray-500"
              }`}
            >
              ID: #{assignment.id}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={`rounded-full border ${
              isActive
                ? "border-blue-300 hover:bg-blue-100"
                : "border-gray-300 hover:bg-gray-100"
            } transition-colors`}
          >
            <X
              className={`h-4 w-4 ${
                isActive
                  ? "text-blue-600 hover:text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            />
          </Button>
        </div>
      </CardHeader>

      <div className="relative flex-1 overflow-hidden">
        <CardContent
          ref={contentRef}
          className="h-full overflow-y-auto scrollbar-hide p-6 space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {assignment.requestDetails.supportType}
                </h2>
                <p className="text-sm text-gray-500">
                  {assignment.requestDetails.disasterEventName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <RequestPriorityBadge priority={assignment.priority} />
                <AssignmentStatusBadge status={assignment.status} />
              </div>
            </div>

            {onStatusChange && (
              <div className="pt-1">
                <AssignmentStatusActions
                  assignment={assignment}
                  onStatusChange={onStatusChange}
                />
              </div>
            )}
          </div>

          <Separator className={`${isActive ? "bg-blue-200" : "bg-gray-200"}`} />

          <DetailSection
            icon={<ClipboardList className="h-4 w-4" />}
            title="Request Details"
          >
            <DetailItem
              label="Quantity"
              value={`${assignment.requestDetails.quantity} ${assignment.requestDetails.unit}`}
            />
            <DetailItem
              label="Description"
              value={
                assignment.requestDetails.description || "No description provided"
              }
              icon={<FileText className="h-4 w-4" />}
            />
          </DetailSection>

          <Separator className={`${isActive ? "bg-blue-200" : "bg-gray-200"}`} />

          <DetailSection
            icon={<Users className="h-4 w-4" />}
            title="Assignment Details"
          >
            <DetailItem label="Assigned To" value={assignment.reliefTeamName} />
            <DetailItem label="Assigned By" value={assignment.assignedByName} />
            <DetailItem
              label="Assigned On"
              value={format(new Date(assignment.assignedAt), "PPPpp")}
              icon={<Calendar className="h-4 w-4" />}
            />
            {assignment.completedAt && (
              <DetailItem
                label="Completed On"
                value={format(new Date(assignment.completedAt), "PPPpp")}
                icon={<Calendar className="h-4 w-4" />}
              />
            )}
          </DetailSection>

          <Separator className={`${isActive ? "bg-blue-200" : "bg-gray-200"}`} />

          <DetailSection
            icon={<User className="h-4 w-4" />}
            title="Requester Information"
          >
            <DetailItem
              label="Contact"
              value={
                <div className="space-y-1">
                  <p>{assignment.requestDetails.contactName}</p>
                  <p className="text-blue-600">
                    {assignment.requestDetails.contactPhone}
                  </p>
                </div>
              }
              icon={<Phone className="h-4 w-4" />}
            />

            {assignment.requestDetails.email && (
              <DetailItem
                label="Email"
                value={
                  <a
                    href={`mailto:${assignment.requestDetails.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {assignment.requestDetails.email}
                  </a>
                }
                icon={<Mail className="h-4 w-4" />}
              />
            )}

            <DetailItem
              label="Address"
              value={assignment.requestDetails.detailedAddress}
              icon={<MapPin className="h-4 w-4" />}
            />
          </DetailSection>

          {assignment.notes && (
            <>
              <Separator
                className={`${isActive ? "bg-blue-200" : "bg-gray-200"}`}
              />
              <DetailSection
                icon={<FileText className="h-4 w-4" />}
                title="Additional Notes"
              >
                <div
                  className={`rounded-lg p-4 ${
                    isActive ? "bg-blue-50" : "bg-gray-50"
                  }`}
                >
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {assignment.notes}
                  </p>
                </div>
              </DetailSection>
            </>
          )}
        </CardContent>

        {showBottomFade && (
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        )}
      </div>

      <CardFooter
        className={`border-t py-4 px-6 ${
          isActive ? "border-blue-200 bg-blue-50/30" : "border-gray-200 bg-gray-50/30"
        }`}
      >
        <div className="flex items-center justify-between w-full text-sm">
          <span className={isActive ? "text-blue-700" : "text-gray-500"}>
            Last updated:{" "}
            {format(
              new Date(assignment.updatedAt || assignment.assignedAt),
              "PPPpp"
            )}
          </span>
          <div className="flex items-center space-x-2">
            <span className={isActive ? "text-blue-700" : "text-gray-500"}>
              Status:
            </span>
            <Badge
              variant={isActive ? "default" : "outline"}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                isActive
                  ? "bg-blue-100 text-blue-800"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              {assignment.status}
            </Badge>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
