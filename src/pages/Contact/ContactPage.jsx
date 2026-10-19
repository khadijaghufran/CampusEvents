import { useState } from 'react';
import FormField from '../../components/common/FormField';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { useForm } from '../../hooks/useForm';
import { validateContactForm } from '../../utils/validators';
import { contactService } from '../../api/contactService';

const TOPIC_OPTIONS = [
  { value: 'General question', label: 'General question' },
  { value: 'Register a society', label: 'Register a society' },
  { value: 'Venue or booking issue', label: 'Venue or booking issue' },
  { value: 'Report a problem', label: 'Report a problem' },
];

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [statusAlert, setStatusAlert] = useState(null); // { type: 'success'|'error', message, title }

  const initialValues = {
    name: '',
    email: '',
    topic: '',
    message: '',
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    resetForm,
    validate,
  } = useForm(initialValues, validateContactForm);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusAlert(null);

    const isValid = validate();
    if (!isValid) return;

    setSubmitting(true);
    try {
      const response = await contactService.sendMessage(values);
      setStatusAlert({
        type: 'success',
        title: 'Inquiry Dispatched',
        message: response.message || 'Your inquiry has been successfully transmitted.',
      });
      resetForm();
    } catch (err) {
      setStatusAlert({
        type: 'error',
        title: 'Transmission Failed',
        message: err.message || 'Unable to submit your inquiry. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
          University Support & Inquiries
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact University Event Office
        </h1>
        <p className="mt-3 text-base text-slate-600">
          Have inquiries regarding society registration, auditorium allocations, or event rules?
          Our coordination team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Contact Form Container (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200/90 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Send an Inquiry</h2>

          {/* Submission status feedback alert */}
          {statusAlert && (
            <div className="mb-6">
              <Alert
                variant={statusAlert.type}
                title={statusAlert.title}
                onClose={() => setStatusAlert(null)}
              >
                {statusAlert.message}
              </Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Full Name */}
            <FormField
              id="name"
              label="Full Name"
              required
              error={touched.name ? errors.name : undefined}
            >
              <Input
                id="name"
                name="name"
                placeholder="e.g. Jane Doe"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && errors.name}
                required
              />
            </FormField>

            {/* Email Address */}
            <FormField
              id="email"
              label="University or Personal Email"
              required
              error={touched.email ? errors.email : undefined}
            >
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. j.doe@campus.edu"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
                required
              />
            </FormField>

            {/* Topic Dropdown */}
            <FormField
              id="topic"
              label="Inquiry Topic"
              required
              error={touched.topic ? errors.topic : undefined}
            >
              <Select
                id="topic"
                name="topic"
                placeholder="Select a category"
                options={TOPIC_OPTIONS}
                value={values.topic}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.topic && errors.topic}
                required
              />
            </FormField>

            {/* Message Body */}
            <FormField
              id="message"
              label="Detailed Message"
              required
              helperText="Minimum 10 characters required."
              error={touched.message ? errors.message : undefined}
            >
              <Textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Please describe your event requirements, venue queries, or issue in detail..."
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.message && errors.message}
                required
              />
            </FormField>

            {/* Submit Action */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={submitting}
                fullWidth
              >
                Send Message
              </Button>
            </div>
          </form>
        </div>

        {/* Office Details Side Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white p-8 rounded-2xl shadow-md space-y-6">
            <div>
              <span className="text-xs font-semibold tracking-wider text-teal-300 uppercase">
                Official Campus Desk
              </span>
              <h2 className="text-xl font-bold mt-1 text-white">
                Office of Student Activities & Events
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Centralized university administration managing faculty venues, society charters,
                and calendar coordination.
              </p>
            </div>

            <div className="space-y-4 text-sm text-slate-200">
              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-teal-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-teal-300 uppercase">Campus Location</p>
                  <p className="font-medium mt-0.5">Student Union Building, Wing B, Room 302</p>
                  <p className="text-xs text-slate-400 mt-0.5">University Central Campus</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-teal-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-teal-300 uppercase">Direct Email</p>
                  <p className="font-medium mt-0.5">studentevents@campus.edu</p>
                  <p className="text-xs text-slate-400 mt-0.5">Response within 24 business hours</p>
                </div>
              </div>

              {/* Office Hours */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-teal-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-teal-300 uppercase">Office Hours</p>
                  <p className="font-medium mt-0.5">Monday – Friday: 9:00 AM – 5:00 PM</p>
                  <p className="text-xs text-slate-400 mt-0.5">Closed on university public holidays</p>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines box */}
          <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Society Chartering Guidelines</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              New societies must submit their constitution and executive roster at least two weeks
              prior to semester commencement for faculty board approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
