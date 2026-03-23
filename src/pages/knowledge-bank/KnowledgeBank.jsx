import React from 'react'
import MasterLayout from '../../masterLayout/MasterLayout'
import KnowledgeBankPage from '../../components/knowledge-bank/KnowledgeBankPage'

const KnowledgeBank = () => {
    return (
        <div>
            <MasterLayout>
                <KnowledgeBankPage />
            </MasterLayout>
        </div>
    )
}

export default KnowledgeBank