import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import {
  getProfile,
  getExperience,
  getProjects,
  getArticles,
} from "@/lib/db";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  if (!isAuthed()) redirect("/admin/login");

  const profile = getProfile()!;
  const experience = getExperience();
  const projects = getProjects();
  const articles = getArticles();

  return (
    <AdminClient
      initialProfile={profile}
      initialExperience={experience}
      initialProjects={projects}
      initialArticles={articles}
    />
  );
}
