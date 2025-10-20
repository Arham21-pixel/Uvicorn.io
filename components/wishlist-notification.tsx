"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";

type WishlistNotificationProps = {
  isVisible: boolean;
  productName: string;
  isAdded: boolean;
  onClose: () => void;
};

export function WishlistNotification({
  isVisible,
  productName,
  isAdded,
  onClose,
}: WishlistNotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="fixed top-24 right-4 z-50 max-w-sm"
        >
          <div
            className={`rounded-lg shadow-2xl border-2 p-4 backdrop-blur-sm ${
              isAdded
                ? "bg-red-50/95 border-red-400 dark:bg-red-900/95 dark:border-red-500"
                : "bg-gray-50/95 border-gray-400 dark:bg-gray-800/95 dark:border-gray-500"
            }`}
          >
            <div className="flex items-start gap-3">
              <motion.div
                animate={isAdded ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.5 }}
                className="text-3xl"
              >
                {isAdded ? "❤️" : "💔"}
              </motion.div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">
                  {isAdded ? "Added to Wishlist!" : "Removed from Wishlist"}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {productName}
                </p>
                {isAdded && (
                  <p className="text-xs mt-1 text-red-600 dark:text-red-400 font-medium">
                    💝 View in Wishlist tab
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Progress Bar */}
            <motion.div
              className={`mt-3 h-1 rounded-full ${
                isAdded ? "bg-red-500" : "bg-gray-400"
              }`}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
