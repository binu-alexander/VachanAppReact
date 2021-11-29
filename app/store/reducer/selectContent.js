import { SELECT_CONTENT,PARALLEL_VISIBLE_VIEW } from '../action/actionsType';

const initialState = {
    modalVisible: false,
    visibleParallelView: false,
    parallelLanguage: {
        languageName: 'Hindi',
        versionCode: 'HindiIRVn',
        sourceId: 24
    },
    parallelMetaData: {
        abbreviation: 'Hindi IRVn',
        contact: 'info@bridgeconn.com',
        contentType: 'Commentary',
        copyrightHolder: 'Bridge Connectivity Solutions',
        description: '',
        languageCode: '',
        languageName: '',
        license: 'Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)',
        licenseURL: '',
        NTURL: '',
        OTURL: '',
        publicDomain: 'No',
        revision: '',
        source: 'Compiled',
        technologyPartner: 'Bridge Connectivity Solutions',
        versionName: 'Hindi IRV Notes',
        versionNameGL: ''
    }
}
function selectContent(state = initialState, action) {
    switch (action.type) {
        case SELECT_CONTENT:
            return {
                ...state,
                parallelMetaData: action.payload.parallelMetaData,
                parallelLanguage: action.payload.parallelLanguage
            }
        case PARALLEL_VISIBLE_VIEW:
            return{
                ...state,
                modalVisible: action.payload.modalVisible,
                visibleParallelView: action.payload.visibleParallelView,
            }
        default:
            return state
    }
}

export default selectContent