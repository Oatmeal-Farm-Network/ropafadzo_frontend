<!DOCTYPE html>
<html>
<head>

<%  PageName = "Registry" %>
<!--#Include virtual="GlobalVariables.asp"-->

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= SEOTitle %> </title>



<meta name="author" content="AndresenEvents.com">
<link rel="shortcut icon" href="<%=ShortIcon%>" /> 
<link rel="icon" href="<%=LongIcon%>" /> 
<meta name="author" content="AndresenEvents.com">
<link rel="stylesheet" type="text/css" href="Style.css">


</head>

<body border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->

<br>
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 bgcolor = "#DBF5F3" width = "800" align = "center">
	<tr>
		<td class ="body2" valign = "top" >

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 bgcolor = "#DBF5F3" width = "600" align = "center">
	<tr>
		<td class ="body2" valign = "top" >
			<H1>List Your Event</H1>
			<h2>Step 1: Tell Us About Your Event</h2>
		</td>
	</tr>

	<tr>
		<td class = "body2" >
			<a name="Add"></a>
			<br>* Required field

		</td>
	</tr>

<form  name=form method="post" action="RegCreateStep2.asp">

	<tr>
		<td height = "1" bgcolor = "#abacab"><Img src = "images/px.gif" height = "0" width = "0"></td>
	</tr>
	<tr>
		<td>
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
<tr>
		<td class = "body2" align = "right" width = "150">
			Event Name:* &nbsp;
		</td>
		<td class = "body2">
			<input name="EventName" Value ="<%=EventName%>"  size = "43" maxlength = "61">
		</td>
</tr>
<tr>
	<td  class = "body2" align = "right">
		Event Type: &nbsp;

	</td>
	<td class = "body2" width = "350"  >
		<select size="1" name="EventTypeID">
					
<% 
  sql = "select * from EventTypesLookup"
response.write("sql ="  & sql & ",br>" )
  Set rs = Server.CreateObject("ADODB.Recordset")
  rs.Open sql, conn, 3, 3   
  if not rs.eof then
  while not rs.eof %>
  
<option value= "<%=rs("EventTypeID") %>"><%=rs("EventType") %></option>
<% 
  rs.movenext
  wend 
end if %>
 </select>
    	</td>
	</tr>
	
	<tr>
		<td class = "body2" align = "right">
			Start Date:&nbsp;
		</td>
		<td>
				<select size="1" name="EventMonth">
					<option value="" selected>------</option>
					<option value="1">Jan.</option>
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
				<select size="1" name="EventDay">
					<option value="" selected>------</option>
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
		<select size="1" name="EventYear">
					<option value="<%=year(now)%>" selected><%=year(now)%></option>
					
				
			<% currentyear = year(date) 
						response.write(currentyear)
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
		
	 </td>
	</tr>
	<tr>
	  <td colspan = "2" align = "center">
		<input type=button value="Next" onclick="verify();">
	</td>
</tr>
</table>
	</td>
</tr>
</table>

 </form> 
<br><br><br>
	

<!--#Include virtual="Footer.asp"--> 
</body >
</HTML>