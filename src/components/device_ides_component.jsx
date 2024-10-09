import Link from "next/link";
import React from "react";

export const DeviceIdesComponent = ({ ids }) => {
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {ids &&
          ids.map((id, index) => (
            <Link
              href={`/my-profile/${id}`}
              key={index}
              className="bg-gray-600 p-2 m-2 text-white rounded-lg hover:bg-gray-700 transition-all"
            >
              <h2 className="text-xl font-semibold text-center">
                {id.toString()}
              </h2>
            </Link>
          ))}
      </div>
    </div>
  );
};
