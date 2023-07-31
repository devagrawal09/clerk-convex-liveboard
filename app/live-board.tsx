"use client";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { clsx } from "clsx";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export const LiveBoard = () => {
  const data = useQuery(api.users.getUsers);

  return (
    <Table>
      <TableCaption>Live Board</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Sessions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map(({ user, sessions }) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell className="flex gap-1">
              {sessions.map((session) => (
                <HoverCard openDelay={100} closeDelay={100}>
                  <HoverCardTrigger>
                    <Badge
                      key={session.id}
                      className={clsx(
                        session.status === "active" &&
                          "bg-green-500 hover:bg-green-600",
                        session.status === "ended" &&
                          "bg-gray-500 hover:bg-gray-600",
                        session.status === "removed" &&
                          "bg-red-500 hover:bg-red-600",
                        session.status === "revoked" &&
                          "bg-red-500 hover:bg-red-600"
                      )}
                    >
                      {session.status}
                    </Badge>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    {/* show created at, last active, and expiry */}
                    <div className="flex flex-col gap-1">
                      <span>
                        <span className="font-bold">Created:</span>{" "}
                        {toDate(session.created_at)}
                      </span>
                      <span>
                        <span className="font-bold">Last:</span>{" "}
                        {toDate(session.last_active_at)}
                      </span>
                      <span>
                        <span className="font-bold">Expires:</span>{" "}
                        {toDate(session.expire_at)}
                      </span>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </TableCell>
          </TableRow>
        )) ?? (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-2xl">
              Loading...
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

function toDate(date: number) {
  return `${new Date(date).toLocaleTimeString()} ${new Date(
    date
  ).toLocaleDateString()}`;
}
