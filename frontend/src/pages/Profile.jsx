import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiCheck, FiX, FiRefreshCcw, FiGithub, FiMail, } from 'react-icons/fi';
import { DotLoader } from 'react-spinners';
import {
      Button, FormGroup
} from 'reactstrap';
import { TagInput } from '../components/reactjs-tag-input';

import api from '../services/api';
import notify from '../services/toast';

import '../assets/css/Profile.css';
import logo from '../assets/img/logo.png';

class Profile extends React.Component {
      constructor(props) {
            super(props);
            this.state = {
                  loading: false,
                  update: true,
                  dev: [],
                  aux: [],
                  email: '',
                  name: '',
                  nameEdit: true,
                  tagsEdit: true,
                  password: '',
                  cpassword: '',
                  githubUser: '',
                  avatar_url: '',
                  tags: [],
                  latitude: '',
                  longitude: '',
                  tagsString: ''
            };
            this.onTagsChanged = this.onTagsChanged.bind(this);
      };

      async componentDidMount() {
            await this.loadDev();
      }

      async  loadDev() {
            await api.get('dev/index', {
                  params: {
                        token: localStorage.getItem('token')
                  }
            })
                  .then((response) => {
                        if (response.data.length === 0)
                              this.props.history.push('/');
                        var user = response.data[0];
                        this.setState({
                              dev: user,
                              email: user.email,
                              githubUser: user.githubUser,
                              name: user.name,
                              avatar_url: user.avatar_url,
                              longitude: user.location.coordinates[0],
                              latitude: user.location.coordinates[1],
                              tagsString: user.techs.join(', ')
                        });
                  })
                  .catch((err) => {
                        notify(`${err.response === undefined ? err.message : err.response.data.message}`, '⚠️', 'error', 'top-right');
                        this.props.history.push('/');
                        return false
                  });
      };

      async getPosition() {
            navigator.geolocation.getCurrentPosition(
                  (position) => {
                        const { latitude, longitude } = position.coords;
                        this.setState({
                              latitude,
                              longitude
                        });
                  },
                  (err) => {
                        notify(err.message, '⚠️', 'error', 'top-right');
                  }, {
                  timeout: 30000
            })
      };

      async handleRegister() {
            this.setState({
                  loading: true,
                  update: true
            });
            if (await this.inputValidation()) {
                  await api.post('dev/updateuser', {
                        name: this.state.name,
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        techs: this.state.tagsString === '' ? undefined : this.state.tagsString.split(', ')
                  },{
                        headers: {
                              Authorization: localStorage.getItem('token'),
                        }
                  })
                        .then((response) => {
                              notify(`User updated successfully!`, '✔️', 'success', 'top-right');
                        })
                        .catch((err) => {
                              notify(`${err.response === undefined ? err.message : err.response.data.message}`, '⚠️', 'error', 'top-right');
                        });
            };

            this.setState({
                  loading: false,
                  update: true,
            });
      };


      onTagsChanged(tags) {
            this.setState({
                  tags,
                  // tagsString: tags.join(', ')
            });
      };

      onTagsEdition() {
            let aux = [];
            let techs = this.state.tagsString.split(",").map(tech => tech.trim());
            var pos = 1;
            for (var i = 0; i < techs.length; i++) {
                  aux = [].concat(aux, [{
                        index: pos,
                        displayValue: techs[i]
                  }]);
                  pos++;
            }
            this.setState({
                  aux,
                  tags: aux,
                  tagsEdit: false,
            });
      };


      onTagsEditionConfirm() {
            let techs = [];
            this.state.tags.map(item => {
                  techs.push(item.displayValue);
            })
            this.setState({
                  tagsString: techs.join(', '),
                  tagsEdit: !this.state.tagsEdit,
                  tags: [],
                  update: false
            })
      };

      async inputValidation() {
            var expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
            var strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');

            if (this.state.email.trim() === '') {
                  return notify('Email field cannot be blank!', '⚠️', 'error', 'top-right');
            }
            else if (!expression.test(String(this.state.email.trim()).toLowerCase())) {
                  return notify('Invalid Email!', '⚠️', 'error', 'top-right');
            }
            // else if (this.state.password === '') {
            //       return notify('Password field cannot be blank!', '⚠️', 'error', 'top-right');
            // }
            // else if (this.state.cpassword === '') {
            //       return notify('Please confirm your password!', '⚠️', 'error', 'top-right');
            // }
            // else if (this.state.password !== this.state.cpassword) {
            //       return notify('Both passwords must be the same!', '⚠️', 'error', 'top-right');
            // }
            // else if (!strongRegex.test(this.state.password)) {
            //       return notify('Your password must contain at least: 8 characters; a lowercase letter and a capital letter; a number; a special character!', '⚠️', 'error', 'top-right');
            // }
            else if (this.state.githubUser.trim() === '') {
                  return notify('GitHub Username field cannot be blank!', '⚠️', 'error', 'top-right');
            }
            else if (this.state.latitude == null || this.state.latitude === '' || isNaN(this.state.latitude)) {
                  return notify('Invalid Latitude coordinate!', '⚠️', 'error', 'top-right');
            }
            else if (this.state.longitude == null || this.state.longitude === '' || isNaN(this.state.latitude)) {
                  return notify('Invalid Longitude coordinate!', '⚠️', 'error', 'top-right');
            }
            else {
                  return true;
            }
      }
      render() {

            let tagsInput = <TagInput
                  tagStyle={`background: linear-gradient(to bottom right, #8b76bf, #71609d, #8b76bf);`}
                  placeholder={'What thechs are you good with? (type and press enter)'}
                  tags={this.state.tags}
                  onTagsChanged={this.onTagsChanged}
            />

            return (
                  <>
                        <div style={{ textAlign: 'center', height: '100px', marginTop: '50px' }}>
                              <img src={logo} alt='Dev Location' style={{ width: '250px' }} />
                        </div>
                        <div className='profile-container'>
                              <div className='content'>
                                    <section>
                                          <div className='logo'>

                                                <img src={this.state.avatar_url} alt={this.state.name} style={{ width: '250px', borderRadius: '50%' }} />
                                          </div>
                                          <p style={{ textAlign: 'center' }}><FiMail size={16} color='#8D54AA' /> {this.state.email}<br />
                                                <FiGithub size={16} color='#8D54AA' /> {this.state.githubUser}</p>


                                          <Link className='back-link' to='/' style={{ color: '#8D54AA' }}>
                                                <FiArrowLeft size={16} color='#8D54AA' />Return to Homepage
                                          </Link>

                                    </section>
                                    <form>
                                          <p>
                                                Name:
                                                {this.state.nameEdit ?
                                                      <button type='button' className='edit-button' onClick={e => this.setState({
                                                            nameEdit: !this.state.nameEdit
                                                      })}>
                                                            {this.state.nameEdit ? <FiEdit size={16} color='#8E4DFF' /> : <FiX size={16} color='#8E4DFF' />}
                                                      </button> : <>
                                                            <button type='button' className='edit-button' onClick={e => {
                                                                  this.setState({
                                                                        nameEdit: !this.state.nameEdit,
                                                                        update: false
                                                                  })
                                                            }} >
                                                                  <FiCheck size={16} color='#8E4DFF' />
                                                            </button>

                                                            <button type='button' className='edit-button'
                                                                  onClick={e => {
                                                                        this.setState({
                                                                              name: this.state.dev.name,
                                                                              nameEdit: !this.state.nameEdit
                                                                        })
                                                                  }}
                                                                  style={{ marginRight: '5px' }}>
                                                                  <FiX size={16} color='#8E4DFF' />
                                                            </button></>
                                                }


                                          </p>
                                          <input type='text' placeholder='Name' value={this.state.name} disabled={this.state.nameEdit} onChange={e => this.setState({ name: e.target.value })} />

                                          {/* <p>
                                          Change Password:
                                          {this.state.nameEdit ?
                                                <button type='button' className='edit-button' onClick={e => setNameEdit(!this.state.nameEdit)}>
                                                      {this.state.nameEdit ? <FiEdit size={16} color='#8E4DFF' /> : <FiX size={16} color='#8E4DFF' />}
                                                </button> : <>
                                                      <button type='button' className='edit-button' onClick={e => {
                                                            setNameEdit(!this.state.nameEdit);
                                                            setUpdate(false);
                                                            }} >
                                                            <FiCheck size={16} color='#8E4DFF' />
                                                      </button>

                                                      <button type='button' className='edit-button'
                                                            onClick={e => {
                                                                  setName(dev.name);
                                                                  setNameEdit(!this.state.nameEdit);
                                                            }}
                                                            style={{ marginRight: '5px' }}>
                                                            <FiX size={16} color='#8E4DFF' />
                                                      </button></>
                                          }


                                    </p>

                                    <input type='password' placeholder='Password' value={this.state.password} onChange={e => setPassword(e.target.value)} />
                                    <p>
                                          Confirm password:
                                    </p> */}
                                          {/* <input type='password' placeholder='Confirm password' value={this.state.cpassword} onChange={e => this.setState({ cpassword: e.target.value })} /> */}
                                          <p>
                                                Techs:
                                                {this.state.tagsEdit ?
                                                      <button type='button' className='edit-button' onClick={() => this.onTagsEdition()}>
                                                            {this.state.tagsEdit ? <FiEdit size={16} color='#8E4DFF' /> : <FiX size={16} color='#8E4DFF' />}
                                                      </button> : <>
                                                            <button type='button' className='edit-button' onClick={() => this.onTagsEditionConfirm()} >
                                                                  <FiCheck size={16} color='#8E4DFF' />
                                                            </button>

                                                            <button type='button' className='edit-button'
                                                                  onClick={e => {
                                                                        this.setState({
                                                                              tags: [],
                                                                              tagsEdit: !this.state.tagsEdit
                                                                        })
                                                                  }}
                                                                  style={{ marginRight: '5px' }}>
                                                                  <FiX size={16} color='#8E4DFF' />
                                                            </button></>
                                                }
                                          </p>
                                          {this.state.tagsEdit ? (
                                                <input type='text' placeholder='Techs' value={this.state.tagsString} disabled={this.state.tagsEdit} />
                                          ) :
                                                <ul className="list-group mt-2">
                                                      {tagsInput}
                                                </ul>}

                                          <p style={{ marginBottom: '-6px', fontSize: '18px' }}>Coordinates:
                                          <button
                                                      type='button'
                                                      className='edit-button'
                                                      onClick={() => {
                                                            this.getPosition()
                                                            this.setState({ update: false })
                                                      }}>
                                                      <FiRefreshCcw size={16} color='#8E4DFF' />
                                                </button>

                                          </p>

                                          <div className='input-group'>
                                                <FormGroup style={{ width: '47.5%' }} >
                                                      <p>
                                                            Latitude:
                                          </p>
                                                      <input type='tel' placeholder='Latitude' value={this.state.latitude}
                                                            pattern="^-?[0-9]\d*\.?\d*$-"
                                                            disabled
                                                      />
                                                </FormGroup>
                                                <FormGroup style={{ width: '47.5%', marginLeft: '5%' }} >
                                                      <p>
                                                            Longitude:
                                          </p>
                                                      <input type='tel' placeholder='Longitude' value={this.state.longitude}
                                                            pattern="^-?[0-9]\d*\.?\d*$-"
                                                            disabled
                                                      />
                                                </FormGroup>
                                          </div>

                                          <Button disabled={this.state.update} color='primary' className='button' type='button' onClick={() => this.handleRegister()}>
                                                {this.state.loading ? <DotLoader
                                                      css={`
                                                      display: block;
                                                      margin: 0 auto;
                                                      border-color: red;
                                                      `}
                                                      sizeUnit={"px"}
                                                      size={20}
                                                      color={'#fff'} /> : 'Update Profile'}
                                          </Button>
                                    </form>
                              </div>

                        </div>
                  </>
            )
      }
};
export default Profile;