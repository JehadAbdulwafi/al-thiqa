"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { createPublicInquiry } from "@/app/actions/public-inquiries";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast"; // Assuming useToast is correctly configured

export function PublicInquiryForm() {
  const searchParams = useSearchParams();
  const referrerId = searchParams.get("referrerId");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<number | string>("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [place, setPlace] = useState("");
  const [type, setType] = useState<"Buy" | "Rent">("Buy");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("age", String(age));
    formData.append("address", address);
    formData.append("country", country);
    formData.append("place", place);
    formData.append("type", type);
    formData.append("budget", budget);
    formData.append("notes", notes);
    if (referrerId) {
      formData.append("referrerId", referrerId);
    }

    startTransition(async () => {
      try {
        await createPublicInquiry(formData);
        toast({
          title: "Inquiry Submitted!",
          description: "Thank you for your inquiry. We will get back to you shortly.",
          variant: "default",
        });
        // Clear form after successful submission (redirection will handle this in action)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to submit inquiry. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-4 md:p-6 bg-card rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-foreground">Submit Your Inquiry</h2>
      {referrerId && (
        <p className="text-sm text-center text-muted-foreground mb-4">
          You were referred by a customer.
        </p>
      )}

      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="place">Place (City/Town)</Label>
        <Input
          id="place"
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="type">Inquiry Type</Label>
        <Select value={type} onValueChange={(value: "Buy" | "Rent") => setType(value)}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Buy">Buy</SelectItem>
            <SelectItem value="Rent">Rent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="budget">Budget (e.g., $500,000)</Label>
        <Input
          id="budget"
          type="text"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Inquiry"}
      </Button>
    </form>
  );
}
