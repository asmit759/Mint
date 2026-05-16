import React from "react";
import { RxCross2 } from "react-icons/rx";
import { LuCheck } from "react-icons/lu";
import { MdDelete } from "react-icons/md";

const ActionButtons = ({ onApprove, onReject, onDelete, status }) => {
  return (
    <div className="flex items-center gap-6 justify-center">
      {status === 'Pending' ? (
        <>
          {/* Reject Button */}
          <div className="group relative">
            <button 
              onClick={onReject}
              className="p-3 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 hover:scale-110 shadow-sm border border-red-500/20"
            >
              <RxCross2 className="w-6 h-6 stroke-[1]" />
            </button>
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 origin-bottom scale-0 px-3 rounded-lg border border-border bg-surface py-1.5 text-xs font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100 text-text-primary whitespace-nowrap">
              Reject
            </span>
          </div>

          {/* Approve Button */}
          <div className="group relative">
            <button 
              onClick={onApprove}
              className="p-3 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-200 hover:scale-110 shadow-sm border border-green-500/20"
            >
              <LuCheck className="w-6 h-6 stroke-[2]" />
            </button>
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 origin-bottom scale-0 px-3 rounded-lg border border-border bg-surface py-1.5 text-xs font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100 text-text-primary whitespace-nowrap">
              Approve
            </span>
          </div>
        </>
      ) : (
        /* Delete Button */
        <div className="group relative">
          <button 
            onClick={onDelete}
            className="p-3 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 hover:scale-110 shadow-sm border border-red-500/20"
          >
            <MdDelete className="w-6 h-6" />
          </button>
          <span className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 origin-bottom scale-0 px-3 rounded-lg border border-border bg-surface py-1.5 text-xs font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100 text-text-primary whitespace-nowrap">
            Delete Record
          </span>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;
