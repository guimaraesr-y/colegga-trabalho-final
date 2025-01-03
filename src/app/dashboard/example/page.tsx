"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuthUser } from "@/providers/authProvider";
import { getFlashes } from "@/actions/flash";
import { Flash } from "@/domain/flash/service";

// ===================================================================
// HEADS UP! This is an example of how to use the paginator in actions
// ===================================================================

export default function TestPage() {
  const [data, setData] = useState<Flash[]>([]);

  const { user } = useAuthUser();

  useEffect(() => {
    getFlashes({
      orderBy: {
        createdAt: "desc"
      }
    })
      .then(data => {
        console.log(data)
        setData(data.data)
      })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-4"
    >
      <h1 className="text-3xl font-bold">Test Page</h1>
      <p>Welcome, {user?.name}!</p>

      <div>
        {data.map(flash => (
          <div key={flash.id}>
            <div>
              {Object.entries(flash).map(([key, value]) => (
                <div key={key}>{`${key}: ${value}`}</div>
              ))}
            </div>
            <p>======</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
