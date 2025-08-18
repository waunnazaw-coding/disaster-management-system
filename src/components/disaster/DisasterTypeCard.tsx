// DisasterTypeCard.tsx
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DisasterType } from "@/api/disasterTypeApi";

interface DisasterTypeCardProps {
  type: DisasterType;
  selected: boolean;
  onSelect: (typeName: string) => void;
  bgClass?: string;
}

const DisasterTypeCard = React.memo(function DisasterTypeCard({
  type,
  selected,
  onSelect,
  bgClass,
}: DisasterTypeCardProps) {
  return (
    <Card
      onClick={() => onSelect(type.name)}
      className={`cursor-pointer mt-2 border ${
        selected ? "border-blue-500" : "border-gray-300"
      } ${bgClass ?? ""}`}
    >
      <CardContent className="bg-black bg-opacity-40 rounded p-2">
        <h3 className="font-bold">{type.name}</h3>
        <p className="text-sm">{type.category}</p>
        <p className="text-xs">{type.description}</p>
      </CardContent>
    </Card>
  );
});

export default DisasterTypeCard;
