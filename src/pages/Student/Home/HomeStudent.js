import React, {useEffect, useState} from "react";
import { withRouter } from "react-router-dom";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import api from '../../../services/api';
import {DialogQuestione} from "../../../components";
import Swal from "sweetalert2";
import * as moment from 'moment';
import 'moment/locale/pt-br';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import ScheduleIcon from '@material-ui/icons/Schedule';
import BlockIcon from '@material-ui/icons/Block';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import {green } from '@material-ui/core/colors';

import {
    Chip, Card, CardContent, List,
    ListItem, ListItemAvatar, ListItemText,  CardMedia,
    CardHeader, Tooltip,
    Button, Typography, TextField, Grid, Divider
} from '@material-ui/core';
import { CheckCircleOutlined } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    root: {
      minWidth: 275,
    },

    list: {
      width: '100%',
      maxWidth: 360,
    },
    fab: {
      margin: 0,
      top: 'auto',
      left: 20,
      bottom: 20,
      right: 'auto',
      position: 'fixed',
    },
    fabGreen: {
      color: "#fff",
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[600],
      },
    },
    cover: {
      width: 130,
      height: 130,
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    searchInput: {
      marginRight: theme.spacing(1)
    },
  }));

const HomeStudent = props => {
    const { className, onClickSearch, menu, history, ...rest } = props;
    const [menuToDay, setMenuToDay] = useState([]);
    const [student, setStudent] = useState([]);
    const [dataV, setdataV] = useState('');
    const classes = useStyles();
    const id_user = localStorage.getItem("@rucedro-id-user");
    const [open, setOpen] = React.useState(false);
    const [idMealRegister, setIdMealRegister] = React.useState(0);
    const [searchText, setSearchText] = React.useState('');


    //configuration alert
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    function loadAlert(icon, message) {
        Toast.fire({
        icon: icon,
        title: message
        });
    }

    async function loadMenutoDay(){
        const date = searchText || dateNow();
        try {
          let url = 'all/menus-today?date='+date;
          const response = await api.get(url);
          setMenuToDay(response.data);
        } catch (error) {
          loadAlert('error', 'Erro de conexão.');
        }
      }


    async function loadStudent(){
      try {
        let url = 'all/show-student/'+id_user;
        const response = await api.get(url);
        setStudent(response.data);
        setdataV(response.data.dateValid);
      } catch (error) {
        loadAlert('error', 'Erro de conexão.');
      }
    }

    function dateNow() {
      let data = new Date();

      let day = ("0" + data.getDate()).slice(-2);
      let month = ("0" + (data.getMonth() + 1) ).slice(-2);
      let year = data.getFullYear();
      let dataString = year +'-'+ month +'-'+ day;
      return dataString;
    }

    useEffect(() => {
        loadStudent();
        setSearchText(dateNow());
    }, []);

    useEffect(()=>{
      loadMenutoDay();
    },[searchText]);

    async function handleMealRegister(){
      const meal_id = idMealRegister;
      const date = searchText || dateNow();
      const data = {
        meal_id, date
      }
      let response= {};
      try {
        response = await api.post('student/schedulings/new', data);
        if (response.status === 202) {
          if(response.data.message){
            loadAlert('error', response.data.message);
          }
        } else {
          loadAlert('success', 'Reserva registrada.');
        }
      } catch (error) {
        loadAlert('error', 'Erro de conexão.');
      }
      setOpen(false);
      loadMenutoDay();
    }

    const onClickOpenDialog = (id) => {
      setIdMealRegister(id);
      setOpen(true);
    }

    const onClickCloseDialog = () => {
      setOpen(false);
      setIdMealRegister(0);
    }

    const onChangeSearch = (e) => {
      setSearchText(e.target.value);
    }

    function checkDateValid(){
      let str = student.dateValid;
      let date = new Date(str);

      let data = new Date();
      let day = data.getDate();
      let month = data.getMonth();
      let year = data.getFullYear();
      let dateString = '';
      if(month<10){
        dateString = year+'-0'+(month+1)+'-'+day;
      } else {
        dateString = year+'-'+(month+1)+'-'+day;
      }

      let str_day = date.getDate();
      let str_month = date.getMonth();
      let str_year = date.getFullYear();
      let str_dateString = '';
      if(str_month<10){
        str_dateString = str_year+'-0'+(str_month+1)+'-'+str_day;
      } else {
        str_dateString = str_year+'-'+(str_month+1)+'-'+str_day;
      }

      if(str_dateString < dateString){
        return true;
      }else{
        return false;
      }
    }
  
    const data_v = dataV.toString().substr(0, 10).split('-').reverse().join('/');

    return(
      
        <div>
        <Grid

        container
        spacing={3}>
        <Grid
          item
          md={12}
          xs={12}>
              <Card className={classes.root}>
                <CardHeader
                    title="Quadro de Avisos">
                </CardHeader>
                <div style={{paddingLeft:"15px"}}>
                {moment().format('LT')>="06:00" && moment().format('LT')<="11:59" ?
                    <CardMedia
                    className={classes.cover}
                    image="/images/home/greetings/cloud.svg"
                    />
                :moment().format('LT')>="12:00" && moment().format('LT')<="17:59" ?
                    <CardMedia
                    className={classes.cover}
                    image="/images/home/greetings/dawn.svg"
                    />
                :moment().format('LT')>="18:00" && moment().format('LT')<="23:59" ?
                    <CardMedia
                    className={classes.cover}
                    image="/images/home/greetings/night.svg"
                    />
                :<CardMedia
                    className={classes.cover}
                    image="/images/home/greetings/night.svg"
                    />
                }
                </div>
                <CardContent>
                    <p>
                    {moment().format('LT')>="00:00" && moment().format('LT')<="11:59" ?"Bom dia !"
                    :moment().format('LT')>="12:00" && moment().format('LT')<="17:59" ?"Boa tarde !"
                    :"Boa noite !"
                    }
                    </p>
                    <p>
                      <strong>Código do Estudante: &nbsp;&nbsp;</strong>
                      <Chip
                        icon={<ConfirmationNumberIcon />}
                        label={student.id || 'carregando...'}
                        color="primary"
                        variant="outlined"
                      />
                    </p>
                    {
                      student.active==0 ?<p>Seu cadastro está <b style={{color:'red'}}>inativo</b>. Procure a assistência estudantil do seu campus.</p>
                      : checkDateValid()
                      ? 
                      <p>Seu cadastro está <b style={{color:'blue'}}>regular</b>. </p>
                      : 
                      student.absent_meal === 5 
                      ? <p>Seu cadastro está <b style={{color:'red'}}>bloqueado</b>. Você esteve ausente em alguma refeição. Procure a assistência estudantil e justifique-se.</p>
                      :
                      <p>Sua situação está regular, e seu cadastro está <b>ativo até: {data_v}</b></p>
                    }
                </CardContent>
              </Card>
          </Grid>
        </Grid>
        <Grid
            container
            spacing={3}>
            <Grid
              item
              md={12}
              xs={12}>
            <Card className={classes.root}>
              <CardHeader
                title="Lista de Refeições">
              </CardHeader>
              <div style={{marginLeft:'16px'}}>
                <form noValidate autoComplete="off">
                  <TextField
                  id="outlined-basic"
                  key="dateSearch"
                  type="date"
                  label="Pesquise por data"
                  variant="outlined"
                  placeholder="Pesquise por data"
                  onChange={onChangeSearch}
                  value={searchText}
                  InputLabelProps={{
                    shrink: true,
                  }}/>
                </form>
              </div>

              <List>
              {menuToDay.map(result => (
                 <div key={result.id}>
                <ListItem>
                  <ListItemAvatar>
                      <ConfirmationNumberIcon  color="action" fontSize="small"/>
                  </ListItemAvatar>
                  <ListItemText
                    primary={result.meal.description}
                    secondary={
                    <React.Fragment>
                      <Typography> <ScheduleIcon /> {result.meal.timeStart} - {result.meal.timeEnd}</Typography>
                    </React.Fragment>
                    }
                  />
                  <ListItem>
                    {
                      result.agendado ?
                      <Chip
                        icon={<CheckCircleOutlineIcon />}
                        label="Já reservado."
                        color="primary"
                      />
                      : result.permission === 1 ?
                      <Tooltip title="Fazer reservar">
                        <Button 
                          variant="outlined" 
                          startIcon={<AlarmOnIcon olor="primary" fontSize="large" />}
                          aria-label="Reservar"
                          onClick={() => onClickOpenDialog(result.meal.id)} >
                          Reservar
                        </Button>
                    </Tooltip>
                    :
                    <Chip
                      icon={<BlockIcon />}
                      label="Reserva não permitida."
                      color="secondary"
                    />
                    }
                    
                  </ListItem>
                  <Divider  light={true}></Divider>
                </ListItem>
                </div>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>
        <Grid
        container
        spacing={3}>
        <Grid
          item
          md={12}
          xs={12}>
        <Card className={classes.root}>
            <CardContent>
            <Typography variant="h5" component="p">
             Cardápio do Dia {searchText.split('-').reverse().join('/')}
            </Typography>
            <br/>
            <Divider  light={true} ></Divider>
                {menuToDay=='' ?
                    <div>
                      <Typography className={classes.title} variant="body1" color="textPrimary">
                            {'Sem refeições para você este dia'}
                        </Typography>
                    </div>
                    :
                    menuToDay.map(result => (
                        <div key={result.id}>
                            <Typography className={classes.title} variant="body1" color="textPrimary">
                                {'Refeição : '+result.meal.description }
                            </Typography>
                            <Typography className={classes.title} variant="body1" color="textPrimary">
                                {'Descrição : '+result.description }
                            </Typography>
                            <Typography className={classes.title} variant="body1" color="textPrimary">
                                {'Horário de inicio : '+result.meal.timeStart }
                            </Typography>
                            <Typography className={classes.title} variant="body1" color="textPrimary">
                                {'Horário de fim: '+result.meal.timeEnd }
                            </Typography>
                            <Divider  ></Divider>
                            <br></br>
                        </div>
                    ))}

            </CardContent>
        </Card>
        </Grid>
        </Grid>
        <DialogQuestione handleClose={onClickCloseDialog}
              open={open}
              onClickAgree={handleMealRegister}
              onClickDisagree={onClickCloseDialog}
              mesage={'Deseja realmente fazer reserva ?'}
              title={'Fazer Reservar'}/>
        </div>
    );
}
HomeStudent.propTypes = {
    className: PropTypes.string,
  };

export default withRouter(HomeStudent);
