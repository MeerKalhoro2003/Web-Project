import React from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-slate-100 mt-10">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-800">Your Profile</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${user?.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
        >
          {user?.isVerified ? "Verified" : "Unverified"}
        </span>
      </div>

      <div className="space-y-4 text-slate-600">
        <div className="grid grid-cols-3">
          <p className="font-semibold text-slate-800">Full Name:</p>
          <p className="col-span-2">{user?.fullName}</p>
        </div>
        <div className="grid grid-cols-3">
          <p className="font-semibold text-slate-800">Email:</p>
          <p className="col-span-2">{user?.email}</p>
        </div>
        <div className="grid grid-cols-3">
          <p className="font-semibold text-slate-800">Phone:</p>
          <p className="col-span-2">{user?.phone || "Not Provided"}</p>
        </div>
        <div className="grid grid-cols-3">
          <p className="font-semibold text-slate-800">Role:</p>
          <p className="col-span-2 capitalize">{user?.role}</p>
        </div>

        <div className="mt-8 pt-4 border-t flex justify-end gap-3">
          <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-50 transition">
            Change Password
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
            Edit Information
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
