# Demo System Rebuild Plan

## Current Issues
1. User gets stuck at recipient selection
2. Inspector panel disappeared (but should be available as option)
3. Implementation feels rushed and half-assed
4. Not flowing smoothly
5. Not functional or impressive

## Root Causes
- Too many components trying to do too much at once
- Detection logic may not be working properly
- Components not properly coordinated
- Rushed implementation without proper testing

## Step-by-Step Rebuild Plan

### Phase 1: Core Detection (Foundation)
**Goal:** Make sure we can reliably detect which stage the user is on

1. **Test OperationalInspectorContext detection logic**
   - Does it correctly identify /send sub-stages?
   - Does currentData update properly?
   - Are the OPERATIONAL_DATA mappings correct?

2. **Add console logging for debugging**
   - Log when location changes
   - Log detected stage
   - Log currentData updates

3. **Verify detection before building UI**

### Phase 2: Single Component at a Time
**Goal:** Get ONE thing working perfectly before adding more

1. **Start with Inspector Panel ONLY**
   - Make sure it opens/closes correctly
   - Verify it shows correct data for each stage
   - Test navigation between stages
   - Polish the styling

2. **Add Stage Progress Tracker**
   - Verify it shows correct stage
   - Test visual transitions
   - Ensure it updates with location changes

3. **Add Interactive Spotlight**
   - Test element detection
   - Verify highlighting works
   - Check positioning
   - Test animations

4. **Finally add Floating Callout**
   - Test smart positioning logic
   - Verify drag functionality
   - Test section navigation
   - Polish animations and styling

### Phase 3: Integration & Coordination
**Goal:** Make all components work together smoothly

1. **Test full flow from dashboard → send → complete**
2. **Verify all components update synchronously**
3. **Test edge cases (rapid navigation, browser resize, etc.)**
4. **Polish transitions and timing**

### Phase 4: Visual Polish
**Goal:** Make it impressive and presentation-ready

1. **Smooth animations** (300-500ms transitions)
2. **Professional color scheme**
3. **Proper spacing and typography**
4. **Responsive to different screen sizes**

## Success Criteria
- ✅ User can click "INSPECTOR" and see immediate visual feedback
- ✅ As they navigate /send flow, everything updates smoothly
- ✅ Floating callout appears in smart position (never blocking)
- ✅ Callout is draggable and smooth
- ✅ Progress tracker shows correct stage
- ✅ Spotlight highlights correct element
- ✅ Inspector panel available as optional reference
- ✅ No stuttering, no broken layouts, no confusion
- ✅ Looks professional and impressive
- ✅ Ready for investor presentations

## Implementation Strategy
- ONE COMPONENT AT A TIME
- Test thoroughly before moving to next
- Console log everything during development
- Remove logs after confirming functionality
- Focus on smooth, polished experience
- Take time to get it right
