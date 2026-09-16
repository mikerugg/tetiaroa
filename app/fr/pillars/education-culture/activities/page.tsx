import { getEducationActivitiesMetadata } from "@/app/pillars/education-activities-metadata";
import { EducationActivitiesPage } from "@/app/pillars/education-activities-page";

export const metadata = getEducationActivitiesMetadata("fr");

export default function FrenchEducationActivities() {
  return <EducationActivitiesPage locale="fr" />;
}
