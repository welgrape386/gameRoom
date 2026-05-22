import type { Character, ChatMessage } from '../../App';
import { ChatBox } from './ChatBox';

interface RightPanelProps {
  messages: ChatMessage[];
  chars: Character[];
  playerCharId: string | null;
  onSendMessage: (text: string) => void;
}

export function RightPanel({
  messages,
  chars,
  playerCharId,
  onSendMessage,
}: RightPanelProps) {
  return (
    <ChatBox
      messages={messages}
      chars={chars}
      playerCharId={playerCharId}
      onSendMessage={onSendMessage}
    />
  );
}