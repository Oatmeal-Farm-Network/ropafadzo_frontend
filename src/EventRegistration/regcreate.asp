<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "Registry" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<title>Create Event</title>
<meta http-equiv="Content-Language" content="en-us">
<meta name="author" content="The Andresen Group"/>
<link rel="stylesheet" type="text/css" href="/style.css" />
<SCRIPT LANGUAGE="JavaScript">
function verify() {
var themessage = "Please fill out the following fields: \r";
if (document.form.EventName.value=="") {
themessage = themessage + " - Event Name \r";
}
if (document.form.EventStartMonth.value=="") {
themessage = themessage + " - Event Start Month \r";
}

if (document.form.EventStartDay.value=="") {
themessage = themessage + " - Event Start Day \r";
}

if (document.form.EventStartYear.value=="") {
themessage = themessage + " - Event Start Year \r";
}

//alert if fields are empty and cancel form submit
if (themessage == "Please fill out the following fields: \r") {
document.form.submit();
}
else {
alert(themessage);
return false;
   }
}
//  End -->
</script>

<SCRIPT LANGUAGE="JavaScript">
<!-- Begin
function checkNumeric(objName,minval, maxval,comma,period,hyphen)
{
	var numberfield = objName;
	if (chkNumeric(objName,minval,maxval,comma,period,hyphen) == false)
	{
		numberfield.select();
		numberfield.focus();
		return false;
	}
	else
	{
		return true;
	}
}

function chkNumeric(objName,minval,maxval,comma,period,hyphen)
{
// only allow 0-9 be entered, plus any values passed
// (can be in any order, and don't have to be comma, period, or hyphen)
// if all numbers allow commas, periods, hyphens or whatever,
// just hard code it here and take out the passed parameters
var checkOK = "0123456789:"  ;
var checkStr = objName;
var allValid = true;
var decPoints = 0;
var allNum = "";

for (i = 0;  i < checkStr.value.length;  i++)
{
ch = checkStr.value.charAt(i);
for (j = 0;  j < checkOK.length;  j++)
if (ch == checkOK.charAt(j))
break;
if (j == checkOK.length)
{
allValid = false;
break;
}
if (ch != ",")
allNum += ch;
}
if (!allValid)
{	
alertsay = "Please enter only these values \""
alertsay = alertsay + checkOK  + "\" ."
alert(alertsay);
return (false);
}

// set the minimum and maximum
var chkVal = allNum;
var prsVal = parseInt(allNum);
if (chkVal != "" && !(prsVal >= minval && prsVal <= maxval))
{
}
}
//  End -->
</script>

<% session("EventID") = ""
    PeopleID = request.querystring("PeopleID")

    EventTypeID = request.querystring("EventTypeID")
if len(PeopleID) > 0 then
 session("PeopleID") = PeopleID
 else
    People = session("PeopleID") 
end if 

if len(EventTypeID) > 0 then
    session("EventTypeID")  = EventTypeID
  else
     EventTypeID = session("EventTypeID") 
end if 

EventName=""
edit = request.querystring("Edit")
eventID = request.querystring("EventID")


if len(edit) < 3 then
  Edit = False
end if 

If Edit = "True" then

sqlA =  "Select * from PaymentOptions where EventID= " & EventID & " order by  PaymentOptionsID DESC "
Set rsA = Server.CreateObject("ADODB.Recordset")

rsA.Open sqlA, conn, 3, 3 
	
if Not rsA.eof  Then

   Checks  = rsA("Checks")
   Paypal  = rsA("Paypal")
   PaypalEmail = rsA("PaypalEmail")
   Checkaddress = rsA("Checkaddress")
   PaymentName = rsA("PaymentName")
   PaymentStreet = rsA("PaymentStreet")
   PaymentStreet2 = rsA("PaymentStreet2")
   PaymentCity = rsA("PaymentCity")
   PaymentState = rsA("PaymentState")
   PaymentZip= rsA("PaymentZip")
   PaymentCountry= rsA("PaymentCountry")
   PaymentOptionsID = rsA("PaymentOptionsID")
end if
				
sql2 = "select * from Event, address, websites, phone where Event.EventID= " & EventID & "  and Event.WebsiteID = Websites.WebsitesID "
acounter = 1
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3 
	
if Not rs2.eof  Then
	PeopleID = rs2("PeopleID")
	if PeopleID > 0 then
		Session("PeopleID") = PeopleID
	end if
	EventName = rs2("EventName")
	EventTypeID = rs2("EventTypeID")
	AddressID = rs2("AddressID")
	WebsiteID = rs2("WebsiteID")
	BusinessID = rs2("BusinessID")
	EventAddressID = rs2("AddressID")
	EventStartMonth = rs2("EventStartMonth")
	EventStartDay = rs2("EventStartDay")
	EventStartYear = rs2("EventStartYear")
	EventEndMonth = rs2("EventEndMonth")
	EventEndDay = rs2("EventEndDay")
	EventWebsite = rs2("Website")
	EventWebsiteID = rs2("WebsiteID")
end if	

sql2 = "select * from EventSchedule where EventID= " & EventID & ""
acounter = 1
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3 
	
while Not rs2.eof  
	ScheduleDateMonth = rs2("ScheduleDateMonth")
	ScheduleDateDay = rs2("ScheduleDateDay")
	ScheduleDateYear = rs2("ScheduleDateYear")
	ScheduleStartTimeHour = rs2("ScheduleStartTimeHour")
	ScheduleEndTimeHour = rs2("ScheduleEndTimeHour")
	ScheduleStartTimeMinute = rs2("ScheduleStartTimeMinute")
if len(ScheduleStartTimeMinute) > 0 then
else
if len(ScheduleStartTimeMinute) =1 then
ScheduleStartTimeMinute = "0" & ScheduleStartTimeMinute
else
ScheduleStartTimeMinute = "00"
end if
end if


	ScheduleEndTimeMinute = rs2("ScheduleEndTimeMinute")
	if len(ScheduleEndTimeMinute) > 0 then
else
if len(ScheduleStartTimeMinute) =1 then
ScheduleEndTimeMinute = "0" & ScheduleEndTimeMinute
else
ScheduleEndTimeMinute = "00"
end if
end if
	ScheduleStartTimeAMPM = rs2("ScheduleStartTimeAMPM")
	ScheduleEndTimeAMPM = rs2("ScheduleEndTimeAMPM")
rs2.movenext
wend


		
sql2 = "select * from Event, Business, address, websites, phone where Event.BusinessID = Business.BusinessID and Event.EventID= " & EventID & " and business.addressId = Address.AddressID and Business.BusinessWebsiteID = Websites.WebsitesID and business.phoneid = Phone.PhoneID"

acounter = 1
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3 
	
if Not rs2.eof  Then
	BusinessID = rs2("BusinessID")
	BusinessName = rs2("BusinessName")
	BusinessWebsiteID = rs2("BusinessWebsiteID")
	BusinessEmail = rs2("BusinessEmail")
	BusinessHours = rs2("BusinessHours")
	BusinessPhoneID = rs2("PhoneID")
	BusinessAddressID = rs2("AddressID")
	BusinessAddress = rs2("AddressStreet")
	BusinessApt= rs2("AddressApt")
	BusinessCity = rs2("AddressCity")
	BusinessState = rs2("AddressState")
	BusinessCountry = rs2("AddressCountry")
	BusinessZip = rs2("AddressZip")
	BusinessPhone = rs2("Phone")
	BusinessCell = rs2("CellPhone")
	BusinessFax = rs2("Fax")
	BusinessTypeID = rs2("BusinessTypeID")
end if	
rs2.close

Conn.Close 
set Conn = Nothing %>
<!--#Include virtual="/Conn.asp"-->

<%
			
sql2 = "select Website from Websites where WebsitesID= " & BusinessWebsiteID 

acounter = 1
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3 
	
if Not rs2.eof  Then
BusinessWebsite = rs2("Website")
end if
rs2.close

sql2 = "select * from Event, EventLocation, address, Phone, Websites where EventLocation.WebsiteID = Websites.WebsitesID and Event.EventLocationID = Eventlocation.EventLocationID and EventLocation.AddressID = Address.AddressID  and Eventlocation.PhoneID = Phone.PhoneID and event.eventid = " & eventid 

acounter = 1
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3 
	
if Not rs2.eof  Then
	EventLocationWebsite = rs2("Website")
	EventLocationWebsiteID = rs2("WebsiteID")
	EventLocationStreet = rs2("AddressStreet")
	EventLocationApt= rs2("AddressApt")
	EventLocationCity = rs2("AddressCity")
	EventLocationState = rs2("AddressState")
	EventLocationCountry = rs2("AddressCountry")
	EventLocationZip = rs2("AddressZip")
	EventLocationPhone = rs2("Phone")
	EventLocationPhoneID = rs2("PhoneID")
	EventLocationCell = rs2("CellPhone")
	EventLocationFax = rs2("Fax")
	EventEndYear = rs2("EventEndYear")
	EventLocationID = rs2("EventLocationID")
	EventLocationName = rs2("EventLocationName")
	EventLocationHours = rs2("EventLocationHours")
	EventLocationEmail = rs2("EventLocationEmail")
	EventLocationAddressID = rs2("AddressID")
end if	


'******************************************************************************************
'  FIND THE BUSINESS TYPE
'******************************************************************************************
sql = "select BusinessType from BusinessTypeLookup where BusinessTypeID = " & BusinessTypeID   & " order by BusinessType Desc;" 

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then
	BusinessType = rs("BusinessType")
End If 
rs.close
end if 
'******************************************************************************************
'  FIND THE EVENT TYPE
'******************************************************************************************
if len(EventTypeID) > 0 then
sql = "select EventType from EventTypesLookup where EventTypeID = " & EventTypeID   & ";" 
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then
	EventType = rs("EventType")
End If 
rs.close
end if
%>
</HEAD>
<% if mobiledevice = True  then %>
<body >
<% else %>
<body onresize="window.location.replace(window.location.href.split('?')[0]  + '?ScreenWidth=' + self.innerWidth);">
<% end if %>
<!--#Include file="AdminEventsHeader.asp"-->
<% Current = "Createevent" %>
<!--#Include file="OverviewHeader.asp"-->
	<br>
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "<%=screenwidth -35 %>"><tr><td class = "roundedtop" align = "left">
		<H1>Create an Event: About Your Event</H1>
</td></tr>
<tr><td class = "roundedBottom">

<form  name=form method="post" action="RegCreateStep2.asp">
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=5 width = "<%=screenwidth -45 %>" align = "center">

	<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			Please enter the following information.
			<br>* Required field
		</td>
	</tr>
	<tr>
	<% if screenwidth < 900 then %>
	   <td width = "50%" valign = "top">
	 <% else %>
	   <td width = "100%" valign = "top">
	 <% end if %>
	
<table border = "0" cellspacing="0" cellpadding = "0" width = "100%" >

<tr><td class = "roundedtop" align = "left"><h2>Event Name and Website</h2></td></tr>
<tr><td class = "roundedBottom">

	   <table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=3  width = "100%" >

	<tr>
				<td  class = "body2" align = "right" width = "130">
					<div align = "right">Event Type:&nbsp;</div>
				</td>
				<td class = "body2"  align = "left">
					<input name="EventTypeID" Value ="<%=EventTypeID%>" type = "hidden" size = "23" maxlength = "61">

					<% if len(EventType) > 0 then %>
					  	<%=EventType %>
					 <% end if %>
    	</td>
	</tr>
	<tr>
		<td class = "body2" align = "right">
			<div align = "right">Event Name:*&nbsp;</div>
		</td>
		<td class = "body2" align = "left">
			<input name="EventName" Value ="<%=EventName%>"  size = "23" maxlength = "61">
		</td>
</tr>
 <tr>
		<td class = "body2" align = "right">
			<div align = "right">Event Website: &nbsp;</div>
		</td>
		<td class = "body2" align = "left">
			<input name="EventWebsiteID" Value ="<%=EventWebsiteID%>"  type = "Hidden">
			http://<input name="EventWebsite" Value ="<%=EventWebsite%>"  size = "23" maxlength = "61">
		</td>
</tr>
</table>
</td>
</tr>
</table>
<br />
<table border = "0" cellspacing="0" cellpadding = "0" width = "100%" >

<tr><td class = "roundedtop" align = "left"><h2>Event Date</h2></td></tr>
<tr><td class = "roundedBottom body">
<i>You will have opportunities to add extra days later.</i>
 <table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=3  width = "100%" >
	<tr>
	<td class = "body">
	<center><b>Date</b></center>
	</td>
	<td class = "body">
	<center><b>Start Time</b></center>
	</td>
	<td class = "body">
	<center><b>End Time</b></center>
	</td>
</tr>
<tr>
<td class = "small">
			<select size="1" name="ScheduleDateMonth" class = "small">
				<% if len(ScheduleDateMonth) > 0 then %>
					<option value="<%=ScheduleDateMonth%>" selected><%=ScheduleDateMonth%></option>
				<% else %>
					<option value="" selected>----</option>
				<% end if %>
					<option value="1"><small>Jan.</small></option>
					<option  value="2">Feb.</option>
					<option  value="3">March</option>
					<option  value="4">April</option>
					<option  value="5">May</option>
					<option  value="6">June</option>
					<option  value="7">July</option>
					<option  value="8">Aug.</option>
					<option  value="9">Sept.</option>
					<option  value="10">Oct.</option>
					<option  value="11">Nov.</option>
					<option  value="12">Dec.</option>
				</select>
				<select size="1" name="ScheduleDateDay" class = "small">
				<% if len(ScheduleDateDay) > 0 then %>
					<option value="<%=ScheduleDateDay%>" selected><%=ScheduleDateDay%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>
					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
				</select>
		<select size="1" name="ScheduleDateYear" class = "small">
					<% if len(ScheduleDateYear) > 0 then %>
					<option value="<%=ScheduleDateYear%>" selected><%=ScheduleDateYear%></option>
				<% else %>
					<option value="<%=year(now)%>" selected><%=year(now)%></option>
				<% end if %>

					
					
				
			<% currentyear = year(date) 
				For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
				<% Next %></select>
		</td>
<td class = "small">
<%if len(ScheduleStartTimeMinute) > 0 then
else
if len(ScheduleStartTimeMinute) =1 then
ScheduleStartTimeMinute = "0" & ScheduleStartTimeMinute
else
ScheduleStartTimeMinute = "00"
end if
end if
if len(ScheduleStartTimeMinute) =1 then
ScheduleStartTimeMinute = "0" & ScheduleStartTimeMinute
end if

 %>
<input name="ScheduleStartTimeHour" Value ="<%=ScheduleStartTimeHour%>" onBlur="checkNumeric(this,-5,5000,',','.','-');" size = "1" maxlength = "2" class = "small">:<input name="ScheduleStartTimeMinute" Value ="<%=ScheduleStartTimeMinute%>" onBlur="checkNumeric(this,-5,5000,',','.','-');" size = "1" maxlength = "2" align = "right" class = "small">
<select size="1" name="ScheduleStartTimeAMPM" class = "small">
<% if len(ScheduleStartTimeAMPM) > 0 then %>
<option value="<%=ScheduleStartTimeAMPM%>" selected><%=ScheduleStartTimeAMPM%></option>
<% end if %>
<option value="AM">AM</option>
<option  value="PM">PM</option>
</select>
</td>
<td class = "small">
<%if len(ScheduleEndTimeMinute) > 0 then
else
if len(ScheduleEndTimeMinute) =1 then
ScheduleEndTimeMinute = "0" & ScheduleEndTimeMinute
else
ScheduleEndTimeMinute = "00"
end if
end if
if len(ScheduleEndTimeMinute) =1 then
ScheduleEndTimeMinute = "0" & ScheduleEndTimeMinute
end if

 %>
<input name="ScheduleEndTimeHour" Value ="<%=ScheduleEndTimeHour%>" onBlur="checkNumeric(this,-5,5000,',','.','-');" size = "1" maxlength = "2" class = "small">:<input name="SScheduleEndTimeMinute" Value ="<%=ScheduleEndTimeMinute%>" onBlur="checkNumeric(this,-5,5000,',','.','-');" size = "1" maxlength = "2" align = "right" class = "small">
<select size="1" name="ScheduleEndTimeAMPM" class = "small">
				<% if len(ScheduleEndTimeAMPM) > 0 then %>
					<option value="<%=ScheduleEndTimeAMPM%>" selected class = "small"><%=ScheduleEndTimeAMPM%></option>
				<% end if %>
					<option value="AM">AM</option>
					<option  value="PM">PM</option>
				</select>
</td>
</tr>

</table>
	 
</td>
</tr>
</table>
        <br />
<%' Event Location Table%>
<table border = "0" cellspacing="0" cellpadding = "0" width = "100%"><tr><td class = "roundedtop" align = "left"><h2>Event Location</h2></td></tr>
<tr><td class = "roundedBottom">
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "100%" align = "center" >

	<tr>
		<td class = "body2" align = "right" width = "155">
			<div align = "right">Name of Location: &nbsp;</div>
		</td>
		<td class = "body2" align = "left" >
			<input name="EventLocationName" Value ="<%=EventLocationName%>"  size = "30" maxlength = "61">
		</td>
	</tr>
	<tr>
		<td class = "body2" align = "right">
			<div align = "right">Location's Website: &nbsp;</div>
		</td>
		<td class = "body2" align = "left">
				<input name="EventLocationWebsiteID" Value ="<%=EventLocationWebsiteID%>"  type = "Hidden">
				http://<input name="EventLocationWebsite" Value ="<%=EventLocationWebsite%>"  size = "23" maxlength = "61">
		</td>
	</tr>
	<tr>
		<td class = "body2" align = "right">
			<div align = "right">Hours Of Operation: &nbsp;</div>
		</td>
		<td class = "body2" align = "left">
				<input name="EventLocationHours" Value ="<%=EventLocationHours%>"  size = "23" maxlength = "61">
		</td>
	</tr>
	<tr>
		<td class = "body2" align = "right">
			<div align = "right">Contact Email: &nbsp;</div>
		</td>
		<td class = "body2" align = "left">
				<input name="EventLocationEmail" Value ="<%=EventLocationEmail%>"  size = "23" maxlength = "61">
		</td>
	</tr>
	<tr>
		<td class = "body2" align = "right">
			<div align = "right">Mailing Address: &nbsp;</div>
		</td>
		<td class = "body2" align = "left">
		<input name="EventLocationAddressID" Value ="<%=EventLocationAddressID%>"  type = "Hidden">

				<input name="EventLocationStreet" Value ="<%=EventLocationStreet%>"  size = "23" maxlength = "61">
		</td>
	</tr>
	<tr>
		<td class = "body2" align = "right">
			<div align = "right">Apartment / Suite: &nbsp;</div>
		</td>
		<td class = "body2" align = "left">
				<input name="EventLocationApt" Value ="<%=EventLocationApt%>"  size = "23" maxlength = "61">
		</td>
	</tr>
	<tr>
		<td class = "body2" align = "right">
			<div align = "right">City: &nbsp;</div>
		</td>
		<td class = "body2" align = "left">
				<input name="EventLocationCity" Value ="<%=EventLocationCity%>"  size = "23" maxlength = "61">
		</td>
	</tr>
	<tr>
		<td  align = "right" class = "body2">
			<div align = "right">State/ Provence: &nbsp;</div>
		</td>
		<td  align = "left" valign = "top" class = "body2">

		<select size="1" name="EventLocationState">
			<% If Len(EventLocationState) > 0 then%>
				<option value="<%=EventLocationState%>" selected><%=EventLocationState%></option>
			<% Else %>
				<option value="" selected>-----</option>
			<% End If %>
			<option value="AL">AL</option>
			<option  value="AK">AK</option>
			<option  value="AZ">AZ</option>
			<option  value="AR">AR</option>
			<option  value="CA">CA</option>
			<option  value="CO">CO</option>
			<option  value="CT">CT</option>
			<option  value="DE">DE</option>
			<option  value="DC">DC</option>
			<option  value="FL">FL</option>
			<option  value="GA">GA</option>
			<option  value="HI">HI</option>
			<option  value="ID">ID</option>
			<option  value="IL">IL</option>
			<option  value="IN">IN</option>
			<option  value="IA">IA</option>
			<option  value="KS">KS</option>
			<option  value="KY">KY</option>
			<option  value="LA">LA</option>
			<option  value="ME">ME</option>
			<option  value="MD">MD</option>
			<option  value="MA">MA</option>
			<option  value="MI">MI</option>
			<option  value="MN">MN</option>
			<option  value="MS">MS</option>
			<option  value="MO">MO</option>
			<option  value="MT">MT</option>
			<option  value="NE">NE</option>
			<option  value="NV">NV</option>
			<option  value="NH">NH</option>
			<option  value="NJ">NJ</option>
			<option  value="NM">NM</option>
			<option  value="NY">NY</option>
			<option  value="NC">NC</option>
			<option  value="ND">ND</option>
			<option  value="OH">OH</option>
			<option  value="OK">OK</option>
			<option  value="OR">OR</option>
			<option  value="PA">PA</option>
			<option  value="RI">RI</option>
			<option  value="SC">SC</option>
			<option  value="SD">SD</option>
			<option  value="TN">TN</option>
			<option  value="TX">TX</option>
			<option  value="UT">UT</option>
			<option  value="VT">VT</option>
			<option  value="VA">VA</option>
			<option  value="WA">WA</option>
			<option  value="WV">WV</option>
			<option  value="WI">WI</option>
			<option  value="WY">WY</option>
			<option  value=""></option>
			<option  value="ON">ON</option>
			<option  value="QC">QC</option>
			<option  value="BC">BC</option>
			<option  value="AB">AB</option>
			<option  value="MB">MB</option>
			<option  value="SK">SK</option>
			<option  value="NS">NS</option>
			<option  value="NB">NB</option>
			<option  value="NL">NL</option>
			<option  value="PE">PE</option>
			<option  value="NT">NT</option>
			<option  value="YK">YK</option>
			<option  value="NU">NU</option>
		</select>
		</td>
	</tr>
	<tr>
		<td   class = "body2" align = "right">
			<div align = "right">Postal Code: &nbsp;</div>
		</td>
		<td  align = "left" valign = "top" class = "body2">
			<input name="EventLocationZip"  size = "8" value = "<%=EventLocationZip%>">
		</td>
	</tr>
	<tr>					
		<td  align = "right" class = "body2">
					<div align = "right">Country:  &nbsp;</div>
		</td>
		<td  align = "left" valign = "top" class = "body2">
		
			<select size="1" name="EventLocationCountry">
				<% if EventLocationCountry = "Canada" then %>
				<option value="USA" >USA</option>
				<option value="Canada" selected>Canada</option>
				<% else %>	
				<option value="USA" selected>USA</option>
				<option value="Canada">Canada</option>
				<% end if %>
		
	        </select>
		</td>
	</tr>
	<tr>
		<td class = "body2" align = "right">
				<div align = "right">Phone: &nbsp;</div>
			</td>
		<td class = "body2" align = "left">
		<input name="EventLocationPhoneID" Value ="<%=EventLocationPhoneID%>"  type = "Hidden">

					<input name="EventLocationPhone" Value ="<%=EventLocationPhone%>"  size = "23" maxlength = "61">
			</td>
	</tr>
	<tr>
		<td class = "body2" align = "right">
				<div align = "right">Cell: &nbsp;</div>
			</td>
		<td class = "body2" align = "left">
			<input name="EventLocationCell" Value ="<%=EventLocationCell%>"  size = "23" maxlength = "61">
			</td>
	</tr>
	<tr>
		<td class = "body2" align = "right">
				<div align = "right">Fax: &nbsp;</div>
			</td>
		<td class = "body2" align = "left">
				<input name="EventLocationFax" Value ="<%=EventLocationFax%>"  size = "23" maxlength = "61">
			</td>
	</tr>
		<tr>
		<td class = "body2" align = "right">
				
			</td>
		<td class = "body2">
&nbsp;
			</td>
	</tr>
</table>
	</td>
	</tr>
</table>
</td>
<% if screenwidth < 898 then %>	
</tr><tr><td width = "100%">
<% else %>
<td width = "50%" valign = "top">
<% end if %>
<% 
show = false
if show = true then
%>

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=3  width = "100%" align = "center">
	<tr>
	   <td  colspan = "2" class = "body2">
			<h3>Primary Contact</h3>
		    Please enter the contact information for the primary contact if other than 
	   </td>

	</tr>	
</table>

<% end if
%>	
<%'Payment Options Table

If not EventTypeID = 5 then

%>
<table border = "0" cellspacing="0" cellpadding = "0" width = "100%"><tr><td class = "roundedtop" align = "left"><h2>Payment Options</h2></td></tr>
<tr><td class = "roundedBottom">	

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=3  width = "420" align = "center">
	<tr>			
	  	<td  colspan = "2" class = "body2" align = "left">
	     	How will you accept payments?  (paypal only, checks only, paypal or checks)
	  	</td>
	 </tr>
	<tr>
		<td class = "body2" colspan = "2" align = "left">
		<% if PayPal = True then
		    PayPalCheck = "checked"
		   else
		   	PayPalCheck = ""
		   end if 
		   
		   if Checks = True then
		    ChecksCheck = "checked"
		   else
		   	ChecksCheck = ""
		   end if
		   %>
					<input name="PaymentOptionsID" Value ="<%=PaymentOptionsID%>"  type = "hidden"><br>
			<input type="checkbox" name="PayPal"  <%=PayPalCheck %> >Paypal<br>
			<img src = "images/px.gif" width = "20" height = "1">Paypal Email Address: &nbsp;
	
				<input name="PaypalEmail" Value ="<%=PaypalEmail%>"  size = "33" ><br>
				<img src = "images/px.gif" width = "20" height = "1"><small>This is the email address associated with your Paypal account.</small>
			</td>
		</tr>
		<tr>
		<td class = "body2" colspan = "2" align = "left">
				<input type="checkbox" name="Checks"  <%=ChecksCheck%> >Check<br>
				<img src = "images/px.gif" width = "20" height = "1">Pay To: <input name="PaymentName"  size = "30" value = "<%=PaymentName%>"><br>
				<img src = "images/px.gif" width = "20" height = "1"><small>Enter the name of the person or organization the check should <br><img src = "images/px.gif" width = "20" height = "1">be addressed to.</small>

			</td>
		</tr>
		<tr>
		  <td   class = "body2" colspan = "2" align = "left">
				<img src = "images/px.gif" width = "20" height = "1">Address that the check should be sent to:
			</td>
		</tr>
		<tr>
		  	<td   class = "body2" align = "right">
				<div align = "right">Mailing Address: &nbsp;</div>
			</td>
			<td  align = "left" valign = "top" class = "body2">
				<input name="PaymentStreet"  size = "30" value = "<%=PaymentStreet%>">
			</td>
		</tr>
		<tr>
			<td   class = "body2"  align = "right">
				<div align = "right">Apartment / Suite: &nbsp;</div>
			</td>
			<td  valign = "top" class = "body2" align = "left">
				<input name="PaymentStreet2"  size = "30" value = "<%=PaymentStreet2%>">
			</td>
		</tr>
		<tr>
			<td   class = "body2" align = "right">
				<div align = "right">City: &nbsp;</div>
			</td>
			<td  valign = "top" class = "body2" align = "left">
				<input name="PaymentCity"  size = "30" value = "<%=PaymentCity%>">
			</td>
		</tr>
		<tr>
			<td  align = "right" class = "body2">
				<div align = "right">State/ Provence: &nbsp;</div>
			</td>
			<td  align = "left" valign = "top" class = "body2">
				<select size="1" name="PaymentState">
				<% If Len(PaymentState) > 0 then%>
					<option value="<%=PaymentState%>" selected><%=PaymentState%></option>
				<% Else %>
					<option value="" selected>-----</option>
				<% End If %>
				<option value="AL">AL</option>
				<option  value="AK">AK</option>
				<option  value="AZ">AZ</option>
				<option  value="AR">AR</option>
				<option  value="CA">CA</option>
				<option  value="CO">CO</option>
				<option  value="CT">CT</option>
				<option  value="DE">DE</option>
				<option  value="DC">DC</option>
				<option  value="FL">FL</option>
				<option  value="GA">GA</option>
				<option  value="HI">HI</option>
				<option  value="ID">ID</option>
				<option  value="IL">IL</option>
				<option  value="IN">IN</option>
				<option  value="IA">IA</option>
				<option  value="KS">KS</option>
				<option  value="KY">KY</option>
				<option  value="LA">LA</option>
				<option  value="ME">ME</option>
				<option  value="MD">MD</option>
				<option  value="MA">MA</option>
				<option  value="MI">MI</option>
				<option  value="MN">MN</option>
				<option  value="MS">MS</option>
				<option  value="MO">MO</option>
				<option  value="MT">MT</option>
				<option  value="NE">NE</option>
				<option  value="NV">NV</option>
				<option  value="NH">NH</option>
				<option  value="NJ">NJ</option>
				<option  value="NM">NM</option>
				<option  value="NY">NY</option>
				<option  value="NC">NC</option>
				<option  value="ND">ND</option>
				<option  value="OH">OH</option>
				<option  value="OK">OK</option>
				<option  value="OR">OR</option>
				<option  value="PA">PA</option>
				<option  value="RI">RI</option>
				<option  value="SC">SC</option>
				<option  value="SD">SD</option>
				<option  value="TN">TN</option>
				<option  value="TX">TX</option>
				<option  value="UT">UT</option>
				<option  value="VT">VT</option>
				<option  value="VA">VA</option>
				<option  value="WA">WA</option>
				<option  value="WV">WV</option>
				<option  value="WI">WI</option>
				<option  value="WY">WY</option>
				<option  value=""></option>
				<option  value="ON">ON</option>
				<option  value="QC">QC</option>
				<option  value="BC">BC</option>
				<option  value="AB">AB</option>
				<option  value="MB">MB</option>
				<option  value="SK">SK</option>
				<option  value="NS">NS</option>
				<option  value="NB">NB</option>
				<option  value="NL">NL</option>
				<option  value="PE">PE</option>
				<option  value="NT">NT</option>
				<option  value="YK">YK</option>
				<option  value="NU">NU</option>
			</select>
		</td>
	</tr>
	<tr>
		<td   class = "body2" align = "right">
			<div align = "right">Postal Code: &nbsp;</div>
		</td>
		<td  align = "left" valign = "top" class = "body2">
			<input name="PaymentZip"  size = "8" value = "<%=PaymentZip%>">
		</td>
	</tr>
	<tr>
		<td  align = "right" class = "body2">
			<div align = "right">Country:  &nbsp;</div>
		</td>
		<td  align = "left" valign = "top" class = "body2">
		
			<select size="1" name="PaymentCountry">
					<% if PaymentCountry = "Canada" then %>
				<option value="USA" >USA</option>
				<option value="Canada" selected>Canada</option>
				<% else %>	
				<option value="USA" selected>USA</option>
				<option value="Canada">Canada</option>
				<% end if %>
		
	        </select>
		</td>
	</tr>
</table>

		</td>
	</tr>
</table><br>
<% end if %>
<%' Who is Putting on the Event Table%>
	<% if screenwidth < 900 then %>
	   <table border = "0" cellspacing="0" cellpadding = "0" width = "100%">
	 <% else %>
	   <table border = "0" cellspacing="0" cellpadding = "0" width = "450">
	 <% end if %>
<tr><td class = "roundedtop" align = "left"><h2>Who is Putting on the Event?</h2></td></tr>
<tr><td class = "roundedBottom">	


<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=3  width = "100%" align = "center">
	<tr>			
	  	<td  colspan = "2" class = "body2">
	     	Please enter below information about the Association or business that is hosting the event, if applicable.
	  	</td>
	</tr>
	<tr>
		<td class = "body2" align = "right" width = "200">
			<div align = "right">Organization's Name: &nbsp;</div>
		</td>
		<td class = "body2" align = "left">
		<input name="BusinessID" Value ="<%=BusinessID%>"  type = "Hidden">
			<input name="BusinessName" Value ="<%=BusinessName%>"  size = "23" maxlength = "61">
		</td>
	</tr>
	<tr>
		<td class = "body2" align = "right">
			<div align = "right">Organization's Type: &nbsp;</div>
		</td>
		<td class = "body2" align = "left">
					
			<select size="1" name="BusinessTypeID">
			<option value= "2">N/A</option>
<% 
  sql = "select * from BusinessTypeLookup where not BusinessTypeID = 2 "
  Set rs = Server.CreateObject("ADODB.Recordset")
  rs.Open sql, conn, 3, 3   
  if not rs.eof then
  while not rs.eof %>
  
		<option value= "<%=rs("BusinessTypeID") %>"><%=rs("BusinessType") %></option>
<% 
  rs.movenext
  wend 
end if %>
 			</select>
		</td>
	</tr>
	<tr>
		<td class = "body2" align = "right">
			<div align = "right">Website: &nbsp;</div>
		</td>
		<td class = "body2" align = "left">
			<input name="BusinessWebsiteID" Value ="<%=BusinessWebsiteID%>"  type = "Hidden">
			http://<input name="BusinessWebsite" Value ="<%=BusinessWebsite%>"  size = "23" maxlength = "61">
		</td>
	</tr>
	<tr>
		<td class = "body2" align = "right">
			<div align = "right">Hours of Operation: &nbsp;</div>
		</td>
		<td class = "body2" align = "left">
			<input name="BusinessHours" Value ="<%=BusinessHours%>"  size = "23" maxlength = "61">
		</td>
	</tr>
	<tr>
		<td class = "body2" align = "right">
			<div align = "right">Contact Email: &nbsp;</div>
		</td>
		<td class = "body2" align = "left">
			<input name="BusinessEmail" Value ="<%=BusinessEmail%>"  size = "23" maxlength = "61">
		</td>
	</tr>
	<tr>
		<td   class = "body2" align = "right">
			<div align = "right">Mailing Address: &nbsp;</div>
		</td>
		<td  align = "left" valign = "top" class = "body2">
			<input name="BusinessAddressID" Value ="<%=BusinessAddressID%>"  type = "Hidden">
			<input name="BusinessAddress"  size = "30" value = "<%=BusinessAddress%>">
		</td>
	</tr>
	<tr>
		<td   class = "body2"  align = "right">
			<div align = "right">Apartment / Suite: &nbsp;</div>
		</td>
		<td  valign = "top" class = "body2" align = "left">
			<input name="BusinessApt"  size = "30" value = "<%=BusinessApt%>">
		</td>
	</tr>
	<tr>
		<td   class = "body2" align = "right">
			<div align = "right">City: &nbsp;</div>
		</td>
		<td  valign = "top" class = "body2" align = "left">
			<input name="BusinessCity"  size = "30" value = "<%=BusinessCity%>">
		</td>
	</tr>
	<tr>
		<td  align = "right" class = "body2">
			<div align = "right">State/ Provence: &nbsp;</div>
		</td>
		<td  align = "left" valign = "top" class = "body2">
			<select size="1" name="BusinessState">
				<% If Len(BusinessState) > 0 then%>
				<option value="<%=BusinessState%>" selected><%=BusinessState%></option>
				<% Else %>
				<option value="" selected>-----</option>
				<% End If %>
				<option value="AL">AL</option>
				<option  value="AK">AK</option>
				<option  value="AZ">AZ</option>
				<option  value="AR">AR</option>
				<option  value="CA">CA</option>
				<option  value="CO">CO</option>
				<option  value="CT">CT</option>
				<option  value="DE">DE</option>
				<option  value="DC">DC</option>
				<option  value="FL">FL</option>
				<option  value="GA">GA</option>
				<option  value="HI">HI</option>
				<option  value="ID">ID</option>
				<option  value="IL">IL</option>
				<option  value="IN">IN</option>
				<option  value="IA">IA</option>
				<option  value="KS">KS</option>
				<option  value="KY">KY</option>
				<option  value="LA">LA</option>
				<option  value="ME">ME</option>
				<option  value="MD">MD</option>
				<option  value="MA">MA</option>
				<option  value="MI">MI</option>
				<option  value="MN">MN</option>
				<option  value="MS">MS</option>
				<option  value="MO">MO</option>
				<option  value="MT">MT</option>
				<option  value="NE">NE</option>
				<option  value="NV">NV</option>
				<option  value="NH">NH</option>
				<option  value="NJ">NJ</option>
				<option  value="NM">NM</option>
				<option  value="NY">NY</option>
				<option  value="NC">NC</option>
				<option  value="ND">ND</option>
				<option  value="OH">OH</option>
				<option  value="OK">OK</option>
				<option  value="OR">OR</option>
				<option  value="PA">PA</option>
				<option  value="RI">RI</option>
				<option  value="SC">SC</option>
				<option  value="SD">SD</option>
				<option  value="TN">TN</option>
				<option  value="TX">TX</option>
				<option  value="UT">UT</option>
				<option  value="VT">VT</option>
				<option  value="VA">VA</option>
				<option  value="WA">WA</option>
				<option  value="WV">WV</option>
				<option  value="WI">WI</option>
				<option  value="WY">WY</option>
				<option  value=""></option>
				<option  value="ON">ON</option>
				<option  value="QC">QC</option>
				<option  value="BC">BC</option>
				<option  value="AB">AB</option>
				<option  value="MB">MB</option>
				<option  value="SK">SK</option>
				<option  value="NS">NS</option>
				<option  value="NB">NB</option>
				<option  value="NL">NL</option>
				<option  value="PE">PE</option>
				<option  value="NT">NT</option>
				<option  value="YK">YK</option>
				<option  value="NU">NU</option>
			</select>
		</td>
	</tr>
	<tr>
		<td   class = "body2" align = "right">
			<div align = "right">Postal Code: &nbsp;</div>
		</td>
		<td  align = "left" valign = "top" class = "body2">
			<input name="BusinessZip"  size = "8" value = "<%=BusinessZip%>">
		</td>
	</tr>
	<tr>
		<td  align = "right" class = "body2">
			<div align = "right">Country:  &nbsp;</div>
		</td>
		<td  align = "left" valign = "top" class = "body2">
			<select size="1" name="BusinessCountry">
					<% if BusinessCountry = "Canada" then %>
				<option value="USA" >USA</option>
				<option value="Canada" selected>Canada</option>
				<% else %>	
				<option value="USA" selected>USA</option>
				<option value="Canada">Canada</option>
				<% end if %>
	    	</select>
		</td>
	</tr>				
	<tr>
		<td   class = "body2" align = "right">
			<div align = "right">Phone: &nbsp;</div>
		</td>
		<td  align = "left" valign = "top" class = "body2">
			<input name="BusinessPhoneID" Value ="<%=BusinessPhoneID%>"  type = "Hidden">
			<input name="BusinessPhone"  size = "30" value = "<%=BusinessPhone%>">
		</td>
	</tr>
	<tr>
		<td   class = "body2" align = "right">
			<div align = "right">Cell: &nbsp;</div>
		</td>
		<td  align = "left" valign = "top" class = "body2">
			<input name="BusinessCell"  size = "30" value = "<%=BusinessCell%>">
		</td>
	</tr>
	<tr>
		<td   class = "body2" align = "right">
			<div align = "right">Fax: &nbsp;</div>
		</td>
		<td  align = "left" valign = "top" class = "body2">
			<input name="BusinessFax"  size = "30" value = "<%=BusinessFax%>">
		</td>
		</tr>
			<tr>
		<td   class = "body2" align = "right">
			 &nbsp;
		</td>
		<td  align = "left" valign = "top" class = "body2">
			
		</td>
		</tr>		
	</table>
	</td>
</tr>
</table>
	</td>
</tr>
</table>
<table width = "100%"  align = "center"  border="0"  cellpadding=0 cellspacing=3 leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<tr>
	<td class ="body2" valign = "top"  align = "center" height = "20"><br>
	<input name="EventID"  type = "hidden" value = "<%=EventID%>">
	<input name="PeopleID"  type = "hidden" value = "<%=PeopleID%>">
		<input name="EventLocationID"  type = "hidden" value = "<%=EventLocationID%>">

	<input name="Edit"  type = "hidden" value = "<%=Edit%>">

		<center><input type=submit value="Proceed to the Next Step"  class = "regsubmit2" ></center>
		<br>	<br>

	</td>
</tr>
</table>
		
					
 </form> 
<br>	</td>
</tr>
</table><br><br>
	

<!--#Include virtual="Footer.asp"--> 
</body>
</HTML>