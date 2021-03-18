import React from 'react'
import loadable from '@loadable/component'

const MediationRequest = loadable(() => import('./mediationRequest'))

export default function LoadableMediationForm({node}){
    return(<div>
        <MediationRequest node={node}/>
    </div>)
}