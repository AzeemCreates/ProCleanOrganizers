import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSiteContent } from "@/lib/site-content-context";

const baseFields = {
  name: z.string().trim().min(1, "Name is required").max(120, "Name is too long"),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(40, "Phone is too long").optional().default(""),
};

const contactSchema = z.object({
  ...baseFields,
  message: z.string().trim().min(1, "Please tell us about your project").max(2000),
});

const bookingSchema = z.object({
  ...baseFields,
  service: z.string().trim().min(1, "Choose a service"),
  preferredTimes: z.string().trim().min(1, "Share a preferred date/time window").max(500),
  message: z.string().trim().min(1, "Briefly describe the project").max(2000),
});

type FormKind = "contact" | "booking";

async function submit(formType: FormKind, payload: Record<string, string>) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formType, ...payload }),
  });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (!res.ok || !data.ok) throw new Error(data.error ?? "Submission failed");
}

export function ContactForm() {
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const values = {
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          message: String(fd.get("message") ?? ""),
        };
        const parsed = contactSchema.safeParse(values);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
          return;
        }
        setBusy(true);
        try {
          await submit("contact", parsed.data);
          toast.success("Message sent. We'll be in touch shortly.");
          (e.target as HTMLFormElement).reset();
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Something went wrong");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="c-name">Name</Label>
          <Input id="c-name" name="name" required maxLength={120} autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="c-email">Email</Label>
          <Input id="c-email" name="email" type="email" required maxLength={255} autoComplete="email" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="c-phone">Phone (optional)</Label>
        <Input id="c-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="c-message">How can we help?</Label>
        <Textarea id="c-message" name="message" required rows={5} maxLength={2000} />
      </div>
      <Button type="submit" size="lg" className="font-bold" disabled={busy}>
        {busy ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

export function BookingForm() {
  const { serviceCategories } = useSiteContent();
  const [busy, setBusy] = useState(false);
  const [service, setService] = useState("");

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const values = {
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          service,
          preferredTimes: String(fd.get("preferredTimes") ?? ""),
          message: String(fd.get("message") ?? ""),
        };
        const parsed = bookingSchema.safeParse(values);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
          return;
        }
        setBusy(true);
        try {
          await submit("booking", parsed.data);
          toast.success("Booking request received. We'll confirm next steps soon.");
          (e.target as HTMLFormElement).reset();
          setService("");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Something went wrong");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="b-name">Name</Label>
          <Input id="b-name" name="name" required maxLength={120} autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="b-email">Email</Label>
          <Input id="b-email" name="email" type="email" required maxLength={255} autoComplete="email" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="b-phone">Phone</Label>
        <Input id="b-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="b-service">Service of interest</Label>
        <Select value={service} onValueChange={setService}>
          <SelectTrigger id="b-service">
            <SelectValue placeholder="Choose a service" />
          </SelectTrigger>
          <SelectContent>
            {serviceCategories.map((cat) => (
              <SelectGroup key={cat.category}>
                <SelectLabel>{cat.category}</SelectLabel>
                {cat.services.map((s) => (
                  <SelectItem key={s.name} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
            <SelectGroup>
              <SelectLabel>Other</SelectLabel>
              <SelectItem value="Not sure yet">Not sure yet - recommend something</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="b-times">Preferred dates &amp; times</Label>
        <Input
          id="b-times"
          name="preferredTimes"
          required
          maxLength={500}
          placeholder="e.g., weekday mornings or Sat Oct 5 afternoon"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="b-message">Brief project description</Label>
        <Textarea id="b-message" name="message" required rows={5} maxLength={2000} />
      </div>
      <Button type="submit" size="lg" className="font-bold" disabled={busy}>
        {busy ? "Sending..." : "Request Booking"}
      </Button>
    </form>
  );
}
