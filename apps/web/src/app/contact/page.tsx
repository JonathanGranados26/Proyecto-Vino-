'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const subject = encodeURIComponent(formData.subject || 'Consulta general');
    const body = encodeURIComponent(
      `Nombre: ${formData.name}\nEmail: ${formData.email}\nTeléfono: ${formData.phone}\n\nMensaje:\n${formData.message}`
    );
    
    window.location.href = `mailto:axelbarrientos031@gmail.com?subject=${subject}&body=${body}`;
    
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <p className="text-gold-600 font-medium tracking-[0.2em] uppercase text-sm mb-4">Estamos para servirle</p>
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-wine-900 mb-6">Contáctenos</h1>
        <div className="w-24 h-1 bg-gold-500 mx-auto" />
        <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-lg">
          ¿Tiene preguntas sobre nuestros productos? Nuestro equipo está listo para atenderle.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-premium border border-cream-200">
            <h3 className="font-serif text-2xl font-bold text-wine-900 mb-6">Información</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-wine-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-wine-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Teléfono / WhatsApp</p>
                  <a href="tel:+50370087508" className="font-semibold text-gray-900 hover:text-wine-700 transition">+503 7008 7508</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-wine-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-wine-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Correo electrónico</p>
                  <a href="mailto:axelbarrientos031@gmail.com" className="font-semibold text-gray-900 hover:text-wine-700 transition break-all">axelbarrientos031@gmail.com</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-wine-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-wine-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Ubicación</p>
                  <p className="font-semibold text-gray-900">El Salvador</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-wine-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-wine-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Horario de atención</p>
                  <p className="font-semibold text-gray-900">Lun - Vie: 9:00 - 18:00</p>
                  <p className="text-sm text-gray-600">Sáb: 10:00 - 14:00</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-premium border border-cream-200">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d249098.123456789!2d-89.2!3d13.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQyJzAwLjAiTiA4OcKwMTInMDAuMCJX!5e0!3m2!1ses!2ssv!4v1234567890" width="100%" height="250" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ubicación" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-8 shadow-premium border border-cream-200">
            <h3 className="font-serif text-2xl font-bold text-wine-900 mb-6">Envíenos un mensaje</h3>
            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                ✅ Su mensaje está listo para enviarse. Revise su cliente de correo.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo *</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico *</label>
                  <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent transition" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
                  <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="Consulta sobre productos" className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje *</label>
                <textarea required rows={6} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="¿En qué podemos ayudarle?" className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent transition resize-none" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-wine-700 text-white rounded-lg font-semibold hover:bg-wine-800 transition flex items-center justify-center gap-2 disabled:opacity-50">
                <Send className="w-5 h-5" />
                {isSubmitting ? 'Preparando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}