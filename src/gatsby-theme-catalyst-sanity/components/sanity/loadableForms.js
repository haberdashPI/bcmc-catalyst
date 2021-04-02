import React from 'react'
import loadable from '@loadable/component'

const MediationRequest = loadable(() => import('./mediationRequest'))
const VolunteerForm = loadable(() => import('./volunteerForm'))
const EventCalendar = loadable(() => import('./eventCalendar'))

export function LoadableMediationForm({node}){
    return(<div>
        <MediationRequest node={node}/>
    </div>)
}

export function LoadableVolunteerForm({node}){
    return(<div>
        <VolunteerForm node={node}/>
    </div>)
}

export function LoadableEventCalendar({node}){
    return (<div>
        <EventCalendar node={node}/>
    </div>)
}