import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import noImage from '../../../assets/img/no-image.png';
import './Repairhalf.css';
import BudgetButton from '../../Button/BudgetButton';
import ModalPDF from '../../Modals/ModalPDF';
import MailtoButton from '../../Button/MailtoButton';

const Repairhalf = ({ id, user, repair, handleRepairsBudget }) => {
  const [pdfShow, setPdfShow] = useState(false);
  const [activeTab, setActiveTab] = useState('');

  const handleBudgetStatus = () => {
    if (
      repair.presupuestar === 'Sí' &&
      repair.f_respuesta_ppto &&
      repair.rechazado === 'No'
    )
      return 1;
    if (
      repair.presupuestar === 'Sí' &&
      repair.f_respuesta_ppto &&
      repair.rechazado !== 'No'
    )
      return 2;
    return 0;
  };

  const [budgetStatus, setBudgetStatus] = useState(handleBudgetStatus);

  const handleBudget = async accepted => {
    const url = `https://extranet-backend.herokuapp.com/budget${
      accepted ? 'accept' : 'reject'
    }`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numero: repair.numero }),
    });
    const data = await response.json();

    if (response.status !== 200) return console.log(data);
    handleRepairsBudget(id, accepted);

    if (accepted) setBudgetStatus(1);
    if (!accepted) setBudgetStatus(2);
  };

  useEffect(() => {
    if (repair.presupuestar === 'Sí') setActiveTab('budget');
    if (repair.presupuestar !== 'Sí') setActiveTab('repair');
    if (repair.f_entrega) setActiveTab('finished');
  }, []);

  return (
    <article className="card-half">
      {pdfShow ? (
        <>
          <div onClick={() => setPdfShow(false)} className="back-drop-pdf" />
          <ModalPDF
            user={user}
            repair={repair}
            pdfShow={pdfShow}
            setPdfShow={setPdfShow}
          />
        </>
      ) : null}

      <section className="repair-info-half">
        <div className="process-status">
          {repair.procesoEstado}
          <MailtoButton repair={repair.numero} />
        </div>
        <div className="number center">{repair.numero}</div>
        <div className="number-customer center">
          <span>Su Referencia:</span>
          <span>{repair.su_referencia}</span>
        </div>
        <img className="watch center" src={noImage} alt={'repair photo'} />
        <div className="repair-type center">{repair.tipo_reparacion}</div>
        <div className="repair-type center">{repair.fecha_compra}</div>
        <FontAwesomeIcon
          onClick={() => setPdfShow(true)}
          icon="file-pdf"
          className="pdf-icon"
        />
      </section>
      <section className="resguardo-half">
        <header>Resguardo</header>
        <div className="main">
          <div className="left">
            <div className="left-tag-data">
              <span className="tag">F. Entrada</span>
              <span className="data">{repair.f_entrada}</span>
            </div>
            <ul className="left-ul-data">
              <span className="tag">Accesorios</span>
              {repair.accesorios ? (
                repair.accesorios.map((acc, i) => {
                  return (
                    <li key={i} className="data-li">
                      {acc}
                    </li>
                  );
                })
              ) : (
                <></>
              )}
            </ul>
          </div>
          <div className="right">
            <div className="right-tag-data">
              <span className="tag">Marca</span>
              <span className="data">{repair.marca}</span>
              <span className="tag">Modelo</span>
              <span className="data">
                {repair.marca === 'CASIO' ? repair.modelo : repair.ref2}
              </span>
              <span className="tag">Tipo</span>
              <span className="data">
                {repair.marca === 'CASIO'
                  ? repair.tipo_aparato
                  : repair.tipo_aparato + ' ' + repair.modelo}
              </span>
            </div>
          </div>
        </div>
        <div className="tag-data">
          <span className="tag left">Avería</span>
          <span className="data-fault left">{repair.averia}</span>
        </div>
        <div className="tag-data">
          <span className="tag left">Observaciones</span>
          <span className="data-remark left">{repair.observaciones}</span>
        </div>
      </section>
      <section className="tab-content">
        {repair.procesoEstado !== 1 &&
        repair.presupuestar === 'Sí' &&
        activeTab === 'budget' ? (
          <article className="presupuesto-half">
            <header>Prespuesto</header>
            <div className="main">
              <div className="left">
                <div className="left-tag-data">
                  <span className="tag">F. Presupuesto</span>
                  <span className="data">{repair.f_presupuesto}</span>
                  <span className="tag">Aceptado</span>
                  <span className="data">
                    {repair.rechazado === 'No' && !repair.f_respuesta_ppto
                      ? '-'
                      : repair.rechazado === 'No'
                      ? 'Sí'
                      : 'No'}
                  </span>
                </div>
              </div>
              <div className="right">
                <div className="right-tag-data">
                  <span className="tag">F. Respuesta</span>
                  <span className="data">{repair.f_respuesta_ppto}</span>
                </div>
              </div>
            </div>
            <div className="tag-data">
              <span className="tag left">Presupuesto</span>
              <span className="data-remark left">{repair.presupuesto}</span>
            </div>
            <div className="main" style={{ marginTop: '1em' }}>
              {repair.presupuestar === 'Sí' && !repair.f_respuesta_ppto ? (
                <BudgetButton handleBudget={handleBudget} />
              ) : (
                <div className="left">
                  <div
                    className={
                      budgetStatus === 1 ? 'stamp is-approved' : 'stamp is-nope'
                    }
                  >
                    {budgetStatus === 1 ? 'Aceptado' : 'Rechazado'}
                  </div>
                </div>
              )}
              {repair.p_liquido > 0 ? (
                <div className="right">
                  <div className="right-tag-data">
                    <span className="tag right">Precio</span>
                    <span className="data right">
                      {repair.p_liquido} € (IVA incl.)
                    </span>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </article>
        ) : (
          <></>
        )}
        {activeTab === 'repair' ? (
          <article className="reparacion-half">
            <header>Reparación</header>
            <div className="main">
              <div className="left">
                <div className="left-tag-data">
                  <span className="tag">F. Reparación</span>
                  <span className="data">{repair.f_reparacion}</span>
                </div>
              </div>
              {repair.modelo_sustutucion ? (
                <div className="right">
                  <div className="right-tag-data">
                    <span className="tag">Cambio reloj</span>
                    <span className="data">{repair.modelo_sustutucion}</span>
                  </div>
                </div>
              ) : (
                <div className="right">
                  <div className="right-tag-data" />
                </div>
              )}
            </div>
            <div className="tag-data">
              <span className="tag left">Reparación</span>
              <span className="data-remark left">{repair.reparacion}</span>
            </div>
            {repair.f_liquido > 0 ? (
              <div className="tag-data">
                <span className="tag right">Precio</span>
                <span className="data right">
                  {repair.f_liquido} € (IVA incl.)
                </span>
              </div>
            ) : (
              <></>
            )}
          </article>
        ) : (
          <></>
        )}
        {repair.f_entrega && activeTab === 'finished' ? (
          <article className="entrega-half">
            <header>Entrega / Envío</header>
            <div className="main">
              <div className="left">
                <div className="left-tag-data">
                  <span className="tag">F. Entrega</span>
                  <span className="data">{repair.f_entrega}</span>
                </div>
              </div>
              <div className="right">
                <div className="right-tag-data">
                  {/*<span className="tag">Tipo Entrega</span>*/}
                  {/*<span className="data">{delivertype}</span>*/}
                  {/*<span className="tag">Agencía</span>*/}
                  {/*<span className="data">{send}</span>*/}
                </div>
              </div>
            </div>
          </article>
        ) : (
          <></>
        )}
      </section>
      <aside className="tabs-wrapper">
        <div
          className={`tab-btn ${
            repair.presupuestar === 'No'
              ? 'disabled'
              : activeTab === 'budget'
              ? 'active'
              : ''
          }`}
          onClick={() => setActiveTab('budget')}
        >
          <FontAwesomeIcon className="tab-icon" icon="receipt" />
        </div>
        <div
          className={`tab-btn ${activeTab === 'repair' ? 'active' : ''}`}
          onClick={() => setActiveTab('repair')}
        >
          <FontAwesomeIcon className="tab-icon" icon="tools" />
        </div>
        <div
          className={`tab-btn ${
            !repair.f_entrega
              ? 'disabled'
              : activeTab === 'finished'
              ? 'active'
              : ''
          }`}
          onClick={() => setActiveTab('finished')}
        >
          <FontAwesomeIcon className="tab-icon" icon="check" />
        </div>
      </aside>
    </article>
  );
};

export default Repairhalf;
