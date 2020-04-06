import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiGithub, FiMail, FiEdit, FiCheck, FiX } from 'react-icons/fi';
import { FaPowerOff, FaUserAlt } from 'react-icons/fa';
import { DotLoader } from 'react-spinners';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import api from '../services/api';
import notify from '../services/toast';

import '../assets/css/Dashboard.css';
import logo from '../assets/img/logo.png';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(true);
  const [devs, setDevs] = useState([]);
  const [xlatitude, setLatitude] = useState('');
  const [xlongitude, setLongitude] = useState('');
  const [avatarUrl, setAvatarURL] = useState('');

  const [user, setUser] = useState([]);
  const [email, setEmail] = useState('');
  const [githubUser, setGitHubUser] = useState('');

  const [tags, setTags] = useState([]);

  const [name, setName] = useState('');
  const [nameEdit, setNameEdit] = useState(true);

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
      },
      (err) => {
        notify(err.message, '⚠️', 'error', 'top-right');
      }, {
      timeout: 30000
    })
  }, []);

  useEffect(() => {
    async function loadDevs() {
      await api.get('dev/index')
        .then((response) => {
          setDevs(response.data)
          return true
        })
        .catch((err) => {
          notify(`${err.response === undefined ? err.message : err.response.data.message}`, '⚠️', 'error', 'top-right');
          return false
        });
    };

    loadDevs();
  }, []);


  useEffect(() => {
    async function loadDev() {
      await api.get('dev/index', {
        params: {
          token: localStorage.getItem('token')
        }
      })
        .then((response) => {
          if (response.data.length === 0)
            history.push('/');
          var user = response.data[0];
          setUser(user);
          setEmail(user.email);
          setName(user.name);
          setGitHubUser(user.githubUser);
          setAvatarURL(user.avatar_url);
          setLongitude(user.location.coordinates[0]);
          setLatitude(user.location.coordinates[1]);
          let aux = [];
          var pos = 1;
          for (var i = 0; i < user.techs.length; i++) {
            aux.push({
              index: pos,
              displayValue: user.techs[i]
            });
            pos++;
          }
          console.log(user.techs)
          setTags(aux);
        })
        .catch((err) => {
          notify(`${err.response === undefined ? err.message : err.response.data.message}`, '⚠️', 'error', 'top-right');
          history.push('/');
          return false
        });
    };

    loadDev();
  }, []);

  async function handleLogout() {
    localStorage.clear()
    history.push('/')
  }


  return (

    <div className='user-container' >
      <header>
        <img src={logo} alt='Be The Hero' />
        <span>
          Welcome, <strong>{localStorage.getItem('name')}</strong>
        </span>

        {/* <Button color="danger" onClick={toggle}>Ok</Button> */}
        <Modal isOpen={modal} toggle={toggle} >
          <div className="modal-header">
            <span className='unselectable'>
              <h5 className="modal-title" id="exampleModalLongTitle">
                <FiMail size={16} color='#8D54AA' /> {email}
                <div className='github'>
                  <FiGithub size={16} color='#8D54AA' /> {githubUser}
                </div>

              </h5>

              <div className='avatar-url'>
                <img src={avatarUrl} alt='Dev Location' />
              </div>
              <form>
                <p>
                  Name:
                    {nameEdit ?
                    <button type='button' className='edit-button' onClick={e => setNameEdit(!nameEdit)}>
                      {nameEdit ? <FiEdit size={16} color='#8E4DFF' /> : <FiX size={16} color='#8E4DFF' />}
                    </button> : <>
                      <button type='button' className='edit-button' onClick={e => {
                        setNameEdit(!nameEdit);
                        setUpdate(false);
                      }} >
                        <FiCheck size={16} color='#8E4DFF' />
                      </button>

                      <button type='button' className='edit-button'
                        onClick={e => {
                          setName(user.name);
                          setNameEdit(!nameEdit);
                        }}
                        style={{ marginRight: '5px' }}>
                        <FiX size={16} color='#8E4DFF' />
                      </button></>
                  }


                </p>
                <input type='text' placeholder='Name' value={name} disabled={nameEdit} onChange={e => setName(e.target.value)} />
              </form>
            </span>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-hidden="true"
              onClick={toggle}
            >
              <i className="tim-icons icon-simple-remove" />
            </button>
          </div>
          <ModalBody style={{ textAlign: 'justify' }}>
            <div dangerouslySetInnerHTML={{ __html: 'teste' }} />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggle}>
              Save
        </Button>
          </ModalFooter>
        </Modal>

        <Link className='linkButton' to='/profile' >
          <FaUserAlt size={18} color='#fff' />
        </Link>

        <button type='button' onClick={handleLogout}>
          <FaPowerOff size={18} color='#8D54AA' />
        </button>
      </header>

      <h1>Devs near you:</h1>

      <ul>
        {devs.map(dev => (
          <li key={dev._id} className='dev-item'>
            <header>
              <img src={dev.avatar_url} alt={dev.name} />
              <div className='user-info'>
                <strong>{dev.name}</strong>
                <span style={{ fontSize: '16px' }}>{dev.techs.join(', ')}</span>
              </div>
            </header><br />
            <p>{dev.bio}</p><br/>
            <div className='footer' style={{ float: 'right', bottom: '0' }} >
              <a href={`https://github.com/${dev.githubUser}`}>
                <FiGithub size={16} color='#8E4DFF' />  Go to GitHub profile
                </a>
            </div>

          </li>
        ))}
      </ul>

    </div >
  )
};