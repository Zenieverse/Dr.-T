import React, { useState } from 'react';
import { GatherEvent, EventType, Currency, PlanningStage } from '../types';
import { X, Sparkles, Calendar, MapPin, Users, DollarSign, Palette, Heart, Check, Compass } from 'lucide-react';

interface EventWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: GatherEvent) => void;
  initialEvent?: GatherEvent | null;
}

const EVENT_TYPES: Array<{ id: EventType; label: string; icon: string; description: string }> = [
  { id: 'wedding', label: 'Wedding & Betrothal', icon: '💍', description: 'Ceremony, rituals, and celebratory banquet' },
  { id: 'anniversary', label: 'Anniversary Milestone', icon: '🥂', description: 'Honoring enduring love and shared journeys' },
  { id: 'birthday', label: 'Birthday & Longevity', icon: '🎂', description: 'Milestone birthdays, Mừng Thọ elder feasts' },
  { id: 'family_celebration', label: 'Family Reunion', icon: '🏡', description: 'Multi-generational gatherings and holidays' },
  { id: 'community_gathering', label: 'Community Gathering', icon: '🏮', description: 'Neighborhood socials, town hall feasts' },
  { id: 'cultural_festival', label: 'Cultural Festival', icon: '🎋', description: 'Heritage traditions, harvest and seasonal rites' },
  { id: 'fundraiser', label: 'Charity & Fundraiser', icon: '🤝', description: 'Benefit galas, craft auctions, giving events' },
  { id: 'custom', label: 'Custom Milestone', icon: '✨', description: 'Unique celebration designed by you' },
];

const CURRENCIES: Currency[] = ['USD', 'VND', 'EUR', 'GBP', 'CAD', 'AUD'];

const PLANNING_STAGES: Array<{ id: PlanningStage; label: string }> = [
  { id: 'ideation', label: '1. Vision & Early Ideation' },
  { id: 'vendor_booking', label: '2. Vendor Selection & Quotes' },
  { id: 'mid_planning', label: '3. Mid-Planning & Invitations' },
  { id: 'final_countdown', label: '4. Final Countdown & Day-Of Prep' },
  { id: 'completed', label: '5. Completed Celebration' },
];

const COMMON_DIETARY = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Halal Friendly',
  'Kosher Friendly',
  'Nut Allergy Safe',
  'Dairy-Free',
  'Elder Soft Foods'
];

const COMMON_ACCESSIBILITY = [
  'Wheelchair Ramps & Step-Free Access',
  'Shaded Seating for Elders & Infants',
  'Quiet Sensory-Relief Lounge',
  'Accessible Restrooms',
  'Large-Print Signage',
  'Dedicated On-Site Parking'
];

export const EventWizardModal: React.FC<EventWizardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEvent
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [title, setTitle] = useState(initialEvent?.title || '');
  const [eventType, setEventType] = useState<EventType>(initialEvent?.eventType || 'wedding');
  const [date, setDate] = useState(initialEvent?.date || '2026-11-28');
  const [time, setTime] = useState(initialEvent?.time || '15:30');
  const [location, setLocation] = useState(initialEvent?.location || '');
  const [venueName, setVenueName] = useState(initialEvent?.venueName || '');
  const [expectedGuests, setExpectedGuests] = useState<number>(initialEvent?.expectedGuests || 80);
  const [currency, setCurrency] = useState<Currency>(initialEvent?.currency || 'USD');
  const [totalBudget, setTotalBudget] = useState<number>(initialEvent?.totalBudget || 15000);
  const [themeStyle, setThemeStyle] = useState(initialEvent?.themeStyle || 'Warm Botanical Garden & Lantern Glow');
  const [culturalPreferences, setCulturalPreferences] = useState(initialEvent?.culturalPreferences || '');
  const [planningStage, setPlanningStage] = useState<PlanningStage>(initialEvent?.planningStage || 'ideation');
  const [notes, setNotes] = useState(initialEvent?.notes || '');

  const [dietaryList, setDietaryList] = useState<string[]>(initialEvent?.dietaryNeeds || ['Vegetarian', 'Gluten-Free']);
  const [accessibilityList, setAccessibilityList] = useState<string[]>(initialEvent?.accessibilityNeeds || ['Wheelchair Ramps & Step-Free Access']);
  const [priorities, setPriorities] = useState<string[]>(
    initialEvent?.priorities || [
      'Warm, generous hospitality for all guests',
      'Atmospheric acoustic music & conversation',
      'Timeless candid photography'
    ]
  );
  const [newPriorityInput, setNewPriorityInput] = useState('');

  if (!isOpen) return null;

  const toggleDietary = (item: string) => {
    setDietaryList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const toggleAccessibility = (item: string) => {
    setAccessibilityList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const addPriority = () => {
    if (newPriorityInput.trim() && !priorities.includes(newPriorityInput.trim())) {
      setPriorities([...priorities, newPriorityInput.trim()]);
      setNewPriorityInput('');
    }
  };

  const removePriority = (index: number) => {
    setPriorities(priorities.filter((_, i) => i !== index));
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setStep(1);
      return;
    }

    const newEvent: GatherEvent = {
      id: initialEvent?.id || `event-${Date.now()}`,
      userId: initialEvent?.userId || 'active-user',
      title: title.trim(),
      eventType,
      date,
      time,
      location: location.trim() || 'Location To Be Announced',
      venueName: venueName.trim() || undefined,
      expectedGuests: Number(expectedGuests) || 50,
      currency,
      totalBudget: Number(totalBudget) || 10000,
      themeStyle: themeStyle.trim() || 'Warm Elegant Celebration',
      dietaryNeeds: dietaryList,
      accessibilityNeeds: accessibilityList,
      culturalPreferences: culturalPreferences.trim(),
      planningStage,
      priorities,
      notes: notes.trim(),
      createdAt: initialEvent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <Sparkles className="w-6 h-6 text-amber-100" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {initialEvent ? 'Edit Celebration Plan' : 'Create New Celebration'}
              </h3>
              <p className="text-xs text-rose-100">
                Gather & Glow • Step {step} of 4
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Stepper Ribbon */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-medium text-slate-500">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center space-x-1.5 transition-colors ${step === 1 ? 'text-rose-600 font-bold' : 'hover:text-slate-800'}`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 1 ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'}`}>1</span>
            <span>The Basics</span>
          </button>
          <div className="w-8 h-px bg-slate-300" />
          <button
            onClick={() => setStep(2)}
            className={`flex items-center space-x-1.5 transition-colors ${step === 2 ? 'text-rose-600 font-bold' : 'hover:text-slate-800'}`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 2 ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'}`}>2</span>
            <span>Guests & Budget</span>
          </button>
          <div className="w-8 h-px bg-slate-300" />
          <button
            onClick={() => setStep(3)}
            className={`flex items-center space-x-1.5 transition-colors ${step === 3 ? 'text-rose-600 font-bold' : 'hover:text-slate-800'}`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 3 ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'}`}>3</span>
            <span>Theme & Heritage</span>
          </button>
          <div className="w-8 h-px bg-slate-300" />
          <button
            onClick={() => setStep(4)}
            className={`flex items-center space-x-1.5 transition-colors ${step === 4 ? 'text-rose-600 font-bold' : 'hover:text-slate-800'}`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 4 ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'}`}>4</span>
            <span>Care & Priorities</span>
          </button>
        </div>

        {/* Wizard Step Body */}
        <form onSubmit={handleFinish} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* STEP 1: The Basics */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Celebration Name / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya & Liam's Garden Wedding & Tea Ceremony"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Celebration Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EVENT_TYPES.map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setEventType(type.id)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        eventType === type.id
                          ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/10 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="text-2xl mb-1.5">{type.icon}</span>
                      <div>
                        <div className={`text-xs font-bold ${eventType === type.id ? 'text-rose-800' : 'text-slate-800'}`}>
                          {type.label}
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight line-clamp-2 mt-0.5">
                          {type.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Event Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    City / Destination / Region
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hoi An & Danang Coast"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Specific Venue / Grounds
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. An Vien Heritage Garden (or TBD)"
                    value={venueName}
                    onChange={e => setVenueName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Guests & Budget */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Expected Number of Guests
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={5000}
                      value={expectedGuests}
                      onChange={e => setExpectedGuests(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm font-bold text-slate-800"
                    />
                    <Users className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Used to size catering, seating tables, and favors accurately.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value as Currency)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm font-semibold text-slate-800"
                  >
                    {CURRENCIES.map(curr => (
                      <option key={curr} value={curr}>{curr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Total Target Budget ({currency})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={totalBudget}
                    onChange={e => setTotalBudget(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-base font-bold text-emerald-700"
                  />
                  <span className="text-sm font-semibold text-slate-400 absolute right-4 top-2.5">
                    {currency}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500 mt-1.5">
                  <span>Estimated Cost Per Guest:</span>
                  <span className="font-semibold text-slate-700">
                    {expectedGuests > 0 ? `${currency} ${Math.round(totalBudget / expectedGuests).toLocaleString()}` : '—'} / guest
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Current Planning Stage
                </label>
                <select
                  value={planningStage}
                  onChange={e => setPlanningStage(e.target.value as PlanningStage)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm font-medium text-slate-800"
                >
                  {PLANNING_STAGES.map(stage => (
                    <option key={stage.id} value={stage.id}>{stage.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: Theme & Heritage */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Preferred Theme, Mood & Style
                </label>
                <input
                  type="text"
                  placeholder="e.g. Warm Botanical Garden & Silk Lantern Glow, or Modern Minimalist Pastel"
                  value={themeStyle}
                  onChange={e => setThemeStyle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  The AI Planner uses this to generate harmonious color palettes, decor arrangements, and lighting ideas.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Cultural Heritage & Traditions (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Traditional Vietnamese tea ceremony (Lễ Đính Hôn) honoring grandparents, followed by an acoustic coastal dinner reception."
                  value={culturalPreferences}
                  onChange={e => setCulturalPreferences(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm"
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Cultural ceremonies, blessings, rites, or family traditions you want honored in the schedule.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Special Notes & Wishes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Grandfather uses a cane and needs quiet seating. We want to avoid loud pyrotechnics."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Care & Priorities */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Dietary Needs to Accommodate
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_DIETARY.map(item => {
                    const isSelected = dietaryList.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleDietary(item)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Accessibility & Comfort Requirements
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_ACCESSIBILITY.map(item => {
                    const isSelected = accessibilityList.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleAccessibility(item)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                          isSelected
                            ? 'bg-purple-50 border-purple-400 text-purple-800 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Key Priorities & Success Metrics
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a priority (e.g. Memorable acoustic music)"
                    value={newPriorityInput}
                    onChange={e => setNewPriorityInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addPriority(); } }}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs"
                  />
                  <button
                    type="button"
                    onClick={addPriority}
                    className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-medium hover:bg-slate-700"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1.5">
                  {priorities.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                      <span className="text-slate-800 font-medium">• {p}</span>
                      <button
                        type="button"
                        onClick={() => removePriority(idx)}
                        className="text-slate-400 hover:text-rose-500 ml-2"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Wizard Footer Navigation */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
              >
                ← Back
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !title.trim()) {
                    return;
                  }
                  setStep((step + 1) as any);
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/20 transition-all"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/20 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>{initialEvent ? 'Save Changes' : 'Create & Generate Plan'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
