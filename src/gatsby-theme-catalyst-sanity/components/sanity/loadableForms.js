import React from 'react'
import loadable from '@loadable/component'

const MediationRequest = loadable(() => import('./mediationRequest'))
const Form = loadable(() => import('./form'))
const Events = loadable(() => import('./eventCalendar'))

export function LoadableMediationForm({node}){
    return(<div>
        <MediationRequest node={node}/>
    </div>)
}

export function LoadableForm({node}){
    return(<div>
        <Form node={node}/>
    </div>)
}

export function LoadableEvents({node}){
    return (<div>
        <Events node={node}/>
    </div>)
}