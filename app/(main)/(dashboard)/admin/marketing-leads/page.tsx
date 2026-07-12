export const dynamic = "force-dynamic";

import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS, MarketingLeadDocument } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { formatRelativeDate } from "@/lib/utils";
import { 
  Users, 
  MessageSquare, 
  Mail, 
  Phone, 
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink
} from "lucide-react";

async function getMarketingLeads() {
  try {
    const { databases } = await createAdminClient();
    const leadsRes = await databases.listDocuments<MarketingLeadDocument>(
      APPWRITE_DB_ID, 
      COLLECTIONS.MARKETING_LEADS, 
      [
        Query.orderDesc("$createdAt"),
        Query.limit(100)
      ]
    );
    
    return leadsRes.documents;
  } catch (error) {
    console.error("Failed to fetch marketing leads:", error);
    return [];
  }
}

export default async function AdminMarketingLeadsPage() {
  const leads = await getMarketingLeads();

  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === "new").length;
  const contactedLeads = leads.filter(l => l.status === "contacted").length;

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Marketing Leads</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Inquiries captured from the gmmx.app public website contact form.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
            <ExternalLink size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card p-6 stat-card-brand">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Total Inquiries</p>
              <h3 className="text-3xl font-black text-slate-900">
                {totalLeads}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-[#FF5C73]">
              <Users size={20} />
            </div>
          </div>
        </div>

        <div className="card p-6 stat-card-warning">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">New / Unread</p>
              <h3 className="text-3xl font-black text-slate-900">
                {newLeads}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Clock size={20} />
            </div>
          </div>
        </div>

        <div className="card p-6 stat-card-success">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Contacted</p>
              <h3 className="text-3xl font-black text-slate-900">
                {contactedLeads}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-900">Recent Inquiries</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Lead Details</th>
                <th className="px-6 py-4">Inquiry & Profile</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Source & Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <MessageSquare size={32} className="mx-auto text-slate-300 mb-3" />
                    <p className="font-medium text-base">No marketing leads yet.</p>
                    <p className="text-sm mt-1">Leads from the contact page will appear here.</p>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.$id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase shrink-0">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-base">{lead.name}</p>
                          {lead.gymName && (
                            <p className="text-xs font-bold text-slate-500 uppercase mt-0.5">{lead.gymName}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 mt-3 text-slate-600 text-xs font-medium">
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-[#FF5C73] transition-colors">
                          <Mail size={12} /> {lead.email}
                        </a>
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-[#FF5C73] transition-colors">
                            <Phone size={12} /> {lead.phone}
                          </a>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 align-top max-w-[200px]">
                      <p className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                        <Activity size={14} className="text-[#FF5C73]"/>
                        {lead.inquiryType}
                      </p>
                      <div className="flex flex-col gap-2">
                        {lead.memberCount && (
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Members</p>
                            <p className="text-xs font-semibold text-slate-700">{lead.memberCount}</p>
                          </div>
                        )}
                        {lead.currentSoftware && (
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Current Software</p>
                            <p className="text-xs font-semibold text-slate-700">{lead.currentSoftware}</p>
                          </div>
                        )}
                        {lead.budget && (
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Budget</p>
                            <p className="text-xs font-semibold text-slate-700">{lead.budget}</p>
                          </div>
                        )}
                        {lead.startDate && (
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Timeline</p>
                            <p className="text-xs font-semibold text-slate-700">{lead.startDate}</p>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 align-top max-w-[300px] whitespace-normal">
                      <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                        "{lead.message}"
                      </p>
                    </td>
                    
                    <td className="px-6 py-4 align-top">
                      <p className="text-slate-900 font-medium mb-1">{formatRelativeDate(lead.$createdAt)}</p>
                      <div className="flex flex-col items-start gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold border border-indigo-100 uppercase tracking-widest">
                          SRC: {lead.source}
                        </span>
                        {lead.status === "new" ? (
                          <span className="badge-warning">New</span>
                        ) : (
                          <span className="badge-success">Contacted</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
