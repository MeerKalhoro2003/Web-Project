import React from "react";
import { Link } from "react-router-dom";
import { Shield, Umbrella, Smartphone, Activity } from "lucide-react";

export default function Landing() {
  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-xl text-slate-900 tracking-tight">
                TakafulGo
              </span>
            </a>
          </div>
          <div className="flex flex-1 justify-end items-center gap-6">
            <Link
              to="/login"
              className="text-sm font-semibold leading-6 text-slate-900"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Micro Parametric Insurance. <br />
            <span className="text-primary-600">Instantly.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Protect your wedding, your health, or your device in just 3 clicks.
            Automated payouts, no paperwork, backed by SECP Sandbox.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/purchase"
              className="rounded-full bg-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all"
            >
              Get Covered Now
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Coverage designed for your life
            </h2>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-slate-900">
                  <Umbrella className="h-6 w-6 text-primary-600" />
                  Rain on Wedding Day
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">
                    Automatic payout if it rains more than 5mm at your outdoor
                    venue.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-slate-900">
                  <Activity className="h-6 w-6 text-primary-600" />
                  Dengue Hospitalization
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">
                    Instant payout upon confirmed hospital admission for dengue
                    fever.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-slate-900">
                  <Smartphone className="h-6 w-6 text-primary-600" />
                  Screen Damage
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">
                    Temporary protection against accidental screen breaks.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
