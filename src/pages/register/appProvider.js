import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  useRef,
} from 'react';
import axiosClient from '../../components/httpClient';
import Languages from '../../includes/language';

const httpClient = axiosClient();

const AppContext = createContext();

const AppProvider = (props) => {
  const { children, comId, userId, email } = props;

  const [lang, setLang] = useState({});
  const [language, setLanguage] = useState([]);
  const [defaultLanguage, setDefaultLanguage] = useState({
    code: 'EN',
    title: 'English',
  });
  const [thisLanguage, setThisLanguage] = useState();
  const [thisLanguageTitle, setThisLanguageTitle] = useState();
  // ****** เดิม step 0
  const [stepCurrent, setStepCurrent] = useState(0);
  // *******
  const [formInformation, setFormInformation] = useState([]);
  const [filePreview, setFilePreview] = useState();
  const [emergencyContactData, setEmergencyContactData] = useState([]);
  const [documentsData, setDocumentsData] = useState([]);
  const [dataDoc, setDataDoc] = useState([]);
  const [informationFormStatus, setInformationFormStatus] = useState(false);
  const [contactsFormStatus, setContactsFormStatus] = useState(false);
  const [documentsFormStatus, setDocumentsFormStatus] = useState(false);
  const [confirmationFormStatus, setConfirmationFormStatus] = useState(false);
  const [informationRef, setInformationRef] = useState(false);

  const [
    informationCurrentStepCount,
    setInformationCurrentStepCount,
  ] = useState(0);
  const [contactsRef, setContactsRef] = useState(false);
  const [documentsRef, setDocumentsRef] = useState(false);

  const getLanguage = async () => {
    const data = [
      { code: 'EN', title: 'English' },
      { code: 'TH', title: 'Thai - ไทย' },
      { code: 'CN', title: 'Chainese - 中文' },
    ];

    setLanguage([...data]);
  };

  const getLang = async () => {
    const langConfig = {
      companyId: '1',
      lang: thisLanguage,
      pageCode: '999',
    };
    const newLang = await Languages(langConfig);

    setLang(newLang);
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const getDocumentTemplate = async () => {
    const result = [];
    try {
      const documentTemplate = await httpClient.get(
        `/v2/documents/${comId}/${userId}`,
      );
      if (documentTemplate.status == 200) {
        documentTemplate.data.forEach((element) => {
          if (element.doc_com_id) {
            const doc = {
              id: element.doc_com_id,
              name: element.name,
              fileList: [],
            };
            result.push(doc);
          }
        });
        setDocumentsData(result);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getLanguage();
    setThisLanguage(defaultLanguage.code);
    getLang();
    getDocumentTemplate();
  }, []);

  useEffect(() => {
    getLang();
  }, [thisLanguage]);

  return (
    <AppContext.Provider
      value={{
        comId,
        userId,
        email,
        state: {
          lang,
          language,
          defaultLanguage,
          thisLanguage,
          thisLanguageTitle,
          stepCurrent,
          formInformation,
          filePreview,
          emergencyContactData,
          informationRef,
          informationFormStatus,
          contactsRef,
          contactsFormStatus,
          documentsRef,
          documentsData,
          dataDoc,
          documentsFormStatus,
          confirmationFormStatus,
          informationCurrentStepCount,
        },
        fnc: {
          setDefaultLanguage,
          setThisLanguage,
          setThisLanguageTitle,
          getBase64,
          setStepCurrent,
          setFormInformation,
          setFilePreview,
          setEmergencyContactData,
          setInformationRef,
          setInformationFormStatus,
          setContactsRef,
          setContactsFormStatus,
          setDocumentsRef,
          setDocumentsData,
          setDataDoc,
          setDocumentsFormStatus,
          setConfirmationFormStatus,
          setInformationCurrentStepCount,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export default {
  AppProvider,
  useAppContext,
};
