import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CorreiosCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
}

export function CorreiosCard({
  icon,
  title,
  description,
  href,
}: CorreiosCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full"
          variant="outline"
          asChild
          aria-disabled="true"
        >
          <a href={href}>Acessar {title}</a>
        </Button>
      </CardContent>
    </Card>
  );
}
