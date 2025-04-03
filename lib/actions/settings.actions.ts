"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { type Remetente } from "@/lib/constants";

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

interface SaveSettingsProps {
  remetente: Remetente;
  path: string;
}

export const saveSettings = async ({ remetente, path }: SaveSettingsProps) => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    // Check if settings already exist for the user
    const existingSettings = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.mailingCollectionId,
      [Query.equal("userId", [currentUser.$id])]
    );

    let settingsDocument;

    if (existingSettings.documents.length > 0) {
      // Update existing settings
      settingsDocument = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.mailingCollectionId,
        existingSettings.documents[0].$id,
        {
          metadata: {
            remetente,
          },
        }
      );
    } else {
      // Create new settings
      settingsDocument = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.mailingCollectionId,
        ID.unique(),
        {
          userId: currentUser.$id,
          metadata: {
            remetente,
          },
        }
      );
    }

    revalidatePath(path);
    return parseStringify(settingsDocument);
  } catch (error) {
    handleError(error, "Failed to save settings");
  }
};

export const getSettings = async () => {
  const session = await createSessionClient();
  if (!session.client) throw new Error("No active session");

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User is not authenticated.");

    const settings = await session.client.databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.mailingCollectionId,
      [Query.equal("userId", [currentUser.$id])]
    );

    if (settings.documents.length === 0) {
      return null;
    }

    return parseStringify(settings.documents[0]);
  } catch (error) {
    handleError(error, "Failed to get settings");
  }
};
