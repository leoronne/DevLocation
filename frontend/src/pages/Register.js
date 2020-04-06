import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { DotLoader } from 'react-spinners';
import {
      Button, FormGroup
} from 'reactstrap';
import { TagInput } from '../components/reactjs-tag-input';

import api from '../services/api';
import notify from '../services/toast';

import '../assets/css/Register.css';
import logo from '../assets/img/logo.png';

export default function Register() {
      const [loading, setLoading] = useState(false);
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [cpassword, setCPassword] = useState('');
      const [githubUser, setGitHubUser] = useState('');

      const [tags, setTags] = useState([]);
      const [xlatitude, setLatitude] = useState('');
      const [xlongitude, setLongitude] = useState('');

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

      async function handleRegister() {
            setLoading(true);
            if (await inputValidation()) {
                  let techs = [];

                  for (let i = 0; i < tags.length; i++) {
                        techs.push((tags[i].displayValue));
                  }
                  await api.post('dev/create', {
                        githubUser,
                        email,
                        password,
                        latitude: xlatitude,
                        longitude: xlongitude,
                        techs
                  })
                        .then((response) => {
                              notify(`User registered successfully!`, '✔️', 'success', 'top-right');
                              setTimeout(
                                    function () {
                                          history.push('/');
                                    },
                                    1000
                              );
                        })
                        .catch((err) => {
                              notify(`${err.response === undefined ? err.message : err.response.data.message}`, '⚠️', 'error', 'top-right');
                        });
            };
            setLoading(false);
      };

      async function inputValidation() {
            var expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
            var strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');

            if (email.trim() === '') {
                  return notify('Email field cannot be blank!', '⚠️', 'error', 'top-right');
            }
            else if (!expression.test(String(email.trim()).toLowerCase())) {
                  return notify('Invalid Email!', '⚠️', 'error', 'top-right');
            }
            else if (password === '') {
                  return notify('Password field cannot be blank!', '⚠️', 'error', 'top-right');
            }
            else if (cpassword === '') {
                  return notify('Please confirm your password!', '⚠️', 'error', 'top-right');
            }
            else if (password !== cpassword) {
                  return notify('Both passwords must be the same!', '⚠️', 'error', 'top-right');
            }
            else if (!strongRegex.test(password)) {
                  return notify('Your password must contain at least: 8 characters; a lowercase letter and a capital letter; a number; a special character!', '⚠️', 'error', 'top-right');
            }
            else if (githubUser.trim() === '') {
                  return notify('GitHub Username field cannot be blank!', '⚠️', 'error', 'top-right');
            }
            else if (xlatitude == null || xlatitude === '' || isNaN(xlatitude)) {
                  return notify('Invalid Latitude coordinate!', '⚠️', 'error', 'top-right');
            }
            else if (xlongitude == null || xlongitude === '' || isNaN(xlatitude)) {
                  return notify('Invalid Longitude coordinate!', '⚠️', 'error', 'top-right');
            }
            else {
                  return true;
            }
      }

      return (
            <>
                  <div className='register-container'>
                        <div className='content'>
                              <section>
                                    <div className='logo'>
                                          <img src={logo} alt='Dev Location' />
                                    </div>
                                    <h1>Register</h1>
                                    <p>
                                          Register at our platform and discover developers around you.
                              </p>


                                    <Link className='back-link' to='/' style={{
                                          color: 'rgb(78, 70, 85)'
                                    }}>
                                          <FiArrowLeft size={16} color='#8D54AA' />Return to Homepage
                              </Link>

                              </section>
                              <form>
                                    <p>
                                          Email:
                              </p>
                                    <input type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />

                                    <p>
                                          Password:
                                    </p>
                                    <input type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
                                    <p>
                                          Confirm password:
                                    </p>
                                    <input type='password' placeholder='Confirm password' value={cpassword} onChange={e => setCPassword(e.target.value)} />
                                    <p>
                                          GitHub Username:
                                    </p>
                                    <input type='text' placeholder='GitHub Username' value={githubUser} onChange={e => setGitHubUser(e.target.value)} />


                                    <p>
                                          Techs:
                                    </p>
                                    <TagInput
                                          tagStyle={`background: linear-gradient(to bottom right, #8b76bf, #71609d, #8b76bf);`}
                                          placeholder={'What thechs are you good with? (type and press enter)'}
                                          tags={tags}
                                          onTagsChanged={
                                                event => setTags(event)
                                          }
                                    />

                                    <div className='input-group'>
                                          <FormGroup style={{ width: '47.5%' }} >
                                                <p>
                                                      Latitude:
                                          </p>
                                                <input type='tel' placeholder='Latitude' value={xlatitude}
                                                      pattern="^-?[0-9]\d*\.?\d*$-"
                                                      disabled
                                                // onInput={event => {
                                                //       var value = event.target.value;
                                                //       var t = 0;
                                                //       value = value.replace(/[^0-9,.-]/g, '');
                                                //       value = value.replace(/,{1,}/g, '.');
                                                //       value = value.replace(/\.{1,}/g, '.');
                                                //       value = value.replace(/\-{1,}/g, '-');
                                                //       value = value.replace(/\./g, function (match) {
                                                //             t++;
                                                //             return (t >= 2) ? '' : match;
                                                //       });
                                                //       setLatitude((value))
                                                // }} 
                                                />
                                          </FormGroup>
                                          <FormGroup style={{ width: '47.5%', marginLeft: '5%' }} >
                                                <p>
                                                      Longitude:
                                          </p>
                                                <input type='tel' placeholder='Longitude' value={xlongitude}
                                                      pattern="^-?[0-9]\d*\.?\d*$-"
                                                      disabled
                                                // onInput={event => {
                                                //       var value = event.target.value;
                                                //       var t = 0;
                                                //       value = value.replace(/[^0-9,.-]/g, '');
                                                //       value = value.replace(/,{1,}/g, '.');
                                                //       value = value.replace(/\.{1,}/g, '.');
                                                //       value = value.replace(/\-{1,}/g, '-');
                                                //       value = value.replace(/\./g, function (match) {
                                                //             t++;
                                                //             return (t >= 2) ? '' : match;
                                                //       });
                                                //       setLongitude((value))
                                                // }}
                                                />
                                          </FormGroup>
                                    </div>
                                    <br />
                                    <Button color='primary' disabled={loading} className='button' type='button' onClick={handleRegister}>
                                          {loading ? <DotLoader
                                                css={`
                                                      display: block;
                                                      margin: 0 auto;
                                                      border-color: red;
                                                      `}
                                                sizeUnit={"px"}
                                                size={20}
                                                color={'#fff'} /> : 'Register'}
                                    </Button>
                              </form>
                        </div>

                  </div>
            </>
      )
};