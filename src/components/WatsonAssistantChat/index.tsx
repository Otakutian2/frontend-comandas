import { UserRoles } from "@/interfaces";
import { useUserStore } from "@/store/user";
import React, { useEffect } from "react";

const WatsonAssistantChatWrapper = () => {
  const user = useUserStore((state) => state.user);
  const role = user?.role.name as UserRoles;
  const canViewBot = role === "Administrador" || role === "Mesero";

  if (!canViewBot) {
    const windowAny = window as any;

    if (windowAny.webChatInstance) {
      const element = document.getElementById("watson-chat-script");
      element?.remove();

      windowAny.webChatInstance.destroy();
      windowAny.webChatInstance.restartConversation();
    }

    return null;
  }

  return <WatsonAssistantChat />;
};

const WatsonAssistantChat: React.FC = () => {
  useEffect(() => {
    if (document.getElementById("watson-chat-script")) {
      return;
    }

    const windowAny = window as any;
    windowAny.watsonAssistantChatOptions = {
      integrationID: "bc1cb584-c345-41b4-92d2-190100232e03",
      region: "au-syd",
      serviceInstanceID: "355a727d-2755-4723-a758-ccf4e12630d8",
      onLoad: function (instance: any) {
        windowAny.webChatInstance = instance;
        instance.render();
      },
    };

    const t = document.createElement("script");
    t.id = "watson-chat-script";
    t.src =
      "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" +
      (windowAny.watsonAssistantChatOptions.clientVersion || "latest") +
      "/WatsonAssistantChatEntry.js";
    document.head.appendChild(t);
  }, []);

  return <div></div>;
};

export default WatsonAssistantChatWrapper;
