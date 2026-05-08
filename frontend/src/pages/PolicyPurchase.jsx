import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function PolicyPurchase() {
  const [step, setStep] = useState(1);
  const [policyTypes, setPolicyTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTierIndex, setSelectedTierIndex] = useState(null);
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await api.get("/policies/types");
        setPolicyTypes(res.data.data.policyTypes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, []);

  const handleNextConfig = (e) => {
    e.preventDefault();
    if (
      !selectedType ||
      selectedTierIndex === null ||
      !eventDate ||
      !location
    ) {
      setError("Please fill in all fields to proceed.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handlePurchase = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/policies/purchase", {
        typeId: selectedType._id,
        eventDate,
        location,
        tierIndex: selectedTierIndex,
        contactEmail: user?.email,
        contactPhone: user?.phone || "03000000000",
        paymentMethod: "card",
      });
      setStep(3); // Success step
    } catch (err) {
      setError(err.response?.data?.error?.message || "Purchase failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === 1)
    return <div className="p-8 text-center">Loading options...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 mb-6"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Progress Bar */}
        <nav aria-label="Progress" className="mb-8">
          <ol
            role="list"
            className="space-y-4 md:flex md:space-x-8 md:space-y-0"
          >
            <li className="md:flex-1">
              <div
                className={`group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${step >= 1 ? "border-primary-600" : "border-slate-200"}`}
              >
                <span
                  className={`text-sm font-medium ${step >= 1 ? "text-primary-600" : "text-slate-500"}`}
                >
                  Step 1: Configure
                </span>
              </div>
            </li>
            <li className="md:flex-1">
              <div
                className={`group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${step >= 2 ? "border-primary-600" : "border-slate-200"}`}
              >
                <span
                  className={`text-sm font-medium ${step >= 2 ? "text-primary-600" : "text-slate-500"}`}
                >
                  Step 2: Review
                </span>
              </div>
            </li>
            <li className="md:flex-1">
              <div
                className={`group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${step >= 3 ? "border-primary-600" : "border-slate-200"}`}
              >
                <span
                  className={`text-sm font-medium ${step >= 3 ? "text-primary-600" : "text-slate-500"}`}
                >
                  Step 3: Payment
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white shadow sm:rounded-lg">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base font-semibold leading-6 text-slate-900">
                Configure Your Policy
              </h3>
              <form onSubmit={handleNextConfig} className="mt-5 space-y-6">
                <div>
                  <label className="text-sm font-medium text-slate-900">
                    1. Select Policy Type
                  </label>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {policyTypes.map((type) => (
                      <div
                        key={type._id}
                        onClick={() => {
                          setSelectedType(type);
                          setSelectedTierIndex(null);
                        }}
                        className={`cursor-pointer rounded-lg border p-4 text-center ${selectedType?._id === type._id ? "border-primary-600 bg-primary-50 ring-1 ring-primary-600" : "border-slate-300 hover:border-primary-400"}`}
                      >
                        <h4 className="font-semibold text-sm text-slate-900">
                          {type.name}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedType && (
                  <div className="animate-in fade-in slide-in-from-top-4">
                    <label className="text-sm font-medium text-slate-900">
                      2. Select Coverage Tier
                    </label>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selectedType.coverageTiers.map((tier, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedTierIndex(idx)}
                          className={`cursor-pointer rounded-lg border p-4 text-center ${selectedTierIndex === idx ? "border-primary-600 bg-primary-50 ring-1 ring-primary-600" : "border-slate-300 hover:border-primary-400"}`}
                        >
                          <div className="font-bold text-slate-900">
                            {tier.label}
                          </div>
                          <div className="text-sm text-slate-500">
                            Premium: Rs {tier.premium}
                          </div>
                          <div className="text-sm text-primary-600 font-semibold mt-1">
                            Payout: Rs {tier.payoutAmount}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium leading-6 text-slate-900">
                      3. Event / Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 px-3 focus:ring-2 focus:ring-primary-600 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-slate-900">
                      4. Location (City)
                    </label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Lahore"
                      className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 px-3 focus:ring-2 focus:ring-primary-600 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    className="w-full rounded-md bg-primary-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                  >
                    Continue to Review
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && selectedType && selectedTierIndex !== null && (
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-semibold leading-6 text-slate-900">
                Review & Pay
              </h3>

              <div className="mt-6 border-t border-slate-100 py-6">
                <dl className="divide-y divide-slate-100">
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-slate-900">
                      Policy Type
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">
                      {selectedType.name}
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-slate-900">
                      Trigger Condition
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">
                      {selectedType.triggerCondition}
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-slate-900">
                      Event Date
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">
                      {new Date(eventDate).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-slate-900">
                      Location
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">
                      {location}
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 bg-slate-50 rounded-lg font-semibold mt-4">
                    <dt className="text-sm leading-6 text-slate-900">
                      Premium to Pay
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-primary-700 sm:col-span-2 sm:mt-0">
                      Rs {selectedType.coverageTiers[selectedTierIndex].premium}
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 bg-green-50 rounded-lg font-semibold mt-2">
                    <dt className="text-sm leading-6 text-slate-900">
                      Potential Payout
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-green-700 sm:col-span-2 sm:mt-0">
                      Rs{" "}
                      {
                        selectedType.coverageTiers[selectedTierIndex]
                          .payoutAmount
                      }
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm font-semibold leading-6 text-slate-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={loading}
                  className="rounded-md bg-primary-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Pay & Issue Policy"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="px-4 py-16 sm:p-12 text-center">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                Policy Issued Successfully!
              </h2>
              <p className="mt-2 text-base text-slate-500">
                Your policy has been activated. A confirmation email has been
                sent.
              </p>
              <div className="mt-8">
                <Link
                  to="/dashboard"
                  className="rounded-md bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
