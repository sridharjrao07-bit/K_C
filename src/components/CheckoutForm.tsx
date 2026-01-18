"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/language-context";
import { useRouter } from "next/navigation";

export default function CheckoutForm({ user }: { user: any }) {
  const { t } = useLanguage();
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  const [shippingStatus, setShippingStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Reset shipping status if pincode changes
    if (name === "pincode") setShippingStatus("idle");
  };

  const checkShipping = async () => {
    if (!formData.pincode || formData.pincode.length < 6) return;
    setShippingStatus("checking");

    // Simulate API call
    setTimeout(() => {
      // Mock validation: allow all except "000000"
      if (formData.pincode === "000000") {
        setShippingStatus("unavailable");
      } else {
        setShippingStatus("available");
      }
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (shippingStatus !== "available") return;

    setIsSubmitting(true);

    try {
      // 1. Create Order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          full_name: formData.fullName,
          phone_number: formData.phone,
          address_line1: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark,
          total_amount: total,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create Order Items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Clear Cart and Show Success
      clearCart();
      setOrderPlaced(true);

    } catch (error) {
      console.error("Order failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#e5d1bf] text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-display font-bold text-[#6f5c46] mb-4">{t("checkout.orderSuccess")}</h2>
        <p className="text-gray-600 mb-8">{t("checkout.orderSuccessDesc")}</p>
        <button
          onClick={() => router.push("/")}
          className="bg-[#6f5c46] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#5a4a38] transition-smooth"
        >
          {t("checkout.backToHome")}
        </button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-[#e5d1bf]">
        <h2 className="text-2xl font-display font-bold text-[#6f5c46] mb-6">{t("checkout.shippingDetails")}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkout.fullName")}</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6f5c46] focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkout.phone")}</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6f5c46] focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkout.pincode")}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="pincode"
                  required
                  maxLength={6}
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6f5c46] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={checkShipping}
                disabled={shippingStatus === "checking" || !formData.pincode}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-smooth ${shippingStatus === "available"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-[#6f5c46] text-white hover:bg-[#5a4a38]"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {shippingStatus === "checking" ? t("checkout.checking") : t("checkout.checkDelivery")}
              </button>
            </div>
          </div>

          {/* Shipping Status Feedback */}
          {shippingStatus === "available" && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t("checkout.deliveryAvailable")}
            </div>
          )}

          {shippingStatus === "unavailable" && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {t("checkout.deliveryUnavailable")}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkout.address")}</label>
            <textarea
              name="address"
              required
              rows={3}
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6f5c46] focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkout.city")}</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6f5c46] focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkout.state")}</label>
              <input
                type="text"
                name="state"
                required
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6f5c46] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkout.landmark")}</label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6f5c46] focus:border-transparent outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || shippingStatus !== "available"}
            className="w-full bg-[#c65d51] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#a84e44] transition-smooth disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {isSubmitting ? t("checkout.processing") : t("checkout.placeOrder")}
          </button>
        </form>
      </div>

      {/* Order Summary Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#e5d1bf]">
          <h3 className="text-xl font-bold text-[#6f5c46] mb-4">Order Summary</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image && (
                    <div className="relative w-full h-full">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 line-clamp-1">{item.title}</h4>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#6f5c46]">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-[#e5d1bf]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">₹{total}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold text-[#6f5c46]">
              <span>{t("checkout.total")}</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#faf7f2] p-4 rounded-xl text-center">
            <svg className="w-8 h-8 text-[#6f5c46] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-xs font-semibold text-[#6f5c46]">Secure Payment</p>
          </div>
          <div className="bg-[#faf7f2] p-4 rounded-xl text-center">
            <svg className="w-8 h-8 text-[#6f5c46] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-xs font-semibold text-[#6f5c46]">Verified Artisans</p>
          </div>
        </div>
      </div>
    </div>
  );
}
