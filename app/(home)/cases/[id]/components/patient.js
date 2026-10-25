// Display helpers for the AI patient (uses only details shown on the case brief)

export function patientName(patient) {
    return patient?.name?.trim() || 'The patient'
}

export function patientFirstName(patient) {
    return patient?.name?.trim().split(/\s+/)[0] || 'The patient'
}

export function patientInitials(patient) {
    const name = patient?.name?.trim()
    if (!name) return 'Pt'
    return name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

export function patientSummary(patient) {
    return [patient?.age != null ? `${patient.age}` : null, patient?.gender, patient?.occupation].filter(Boolean).join(' · ')
}
