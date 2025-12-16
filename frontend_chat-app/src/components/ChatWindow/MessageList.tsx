import React from "react";

const MessageList: React.FC = () => {
  return;
  <div
    // ref={containerRef}
    className="flex-1 bg-gray-50 overflow-y-auto p-4 pb-10"
  >
    {/* {hasNextPage && (
      <div className="flex justify-center mb-4">
        <button
          type="button"
          className="px-2 py-1 text-xs bg-gray-300 text-white rounded-lg
                    hover:bg-gray-400 transition-colors cursor-pointer
                "
          onClick={handleLoadMore}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      </div>
    )}

    {allMessages.map((message) => (
      <div key={message._id}>
        <MessageItem {...message} />
      </div>
    ))}

    {isTyping && <TypingIndicator />} */}
  </div>;
};

export default MessageList;
