<%@ Language="VBScript" %> 

<html>
<head>

<!--#Include virtual="GlobalVariables.asp"-->
<title>Add Student</title>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">


<meta name="author" content="The Andresen Group">
<link rel="shortcut icon" href="<%=ShortIcon%>" /> 
<link rel="icon" href="<%=LongIcon%>" /> 
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="Style.css">
<% message=request.querystring("message")%>

<SCRIPT LANGUAGE="JavaScript">
function verify() {
var themessage = "Please fill out the following fields: \r";
if (document.form.BusinessEmail.value=="") {
themessage = themessage + " - EMail Addrerss \r";
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

<% 
PeopleFirstName = Request.Querystring("PeopleFirstName")
PeopleLastName= Request.Querystring("PeopleLastName")
PeopleEmail= Request.Querystring("PeopleEmail")
PeoplePhone= Request.Querystring("PeoplePhone")
PeopleCell= Request.Querystring("PeopleCell")
PeopleFax= Request.Querystring("PeopleFax")
AddressStreet= Request.Querystring("AddressStreet")
AddressApt= Request.Querystring("AddressApt")
AddressCity= Request.Querystring("AddressCity")
AddressState= Request.Querystring("AddressState")
AddressCountry= Request.Querystring("AddressCountry")
AddressZip= Request.Querystring("AddressZip")
NumberAttending = Request.Querystring("NumberAttending")
ClassPaidAmount = Request.Querystring("ClassPaidAmount")
ClassPaidAmountMonth = Request.Querystring("ClassPaidAmountMonth")
ClassPaidAmountDay = Request.Querystring("ClassPaidAmountDay")
ClassPaidAmountYear = Request.Querystring("ClassPaidAmountYear") %>
</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->
<!--#Include file="ClassesHeader.asp"-->


<% PageTitleText = "Add a Student"  %>
<!--#Include file="970Top.asp"-->

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "900" align = "center">
	<tr><td Class = "menu2">
	
	<% 
	 NoClass=False
	sql = "select * from ClassInfo where EventID = " & EventID  &  ""
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

if rs.eof then
   NoClass=True
 %>
Before you can add students you need at least one class entered. Currently you do not have any classes listed. <br>
To add classes please select  <a href = "ClassesAdd.asp?EventID=<%=EventID%>" class = "menu2">Add Classes</a>.

	
<% else %>	
	Enter the student's information below: (* Indicates Required Fields)<br>
<% end if %>			
			<% if len(Message) > 1 then %><br>
				<font color = "red"><b><%=Message%></b></font>
			<% end if %>
		</td>
	</tr>
</table>
<% if  NoClass=False then %>
<!--#Include virtual="PeopleDataInclude.asp"--> 


<form  name="form" action="ClassesAddStudentHandleForm.asp" method = "post">

<input name="Action" Value ="Add"  type = "hidden">

<input name="EventID" Value ="<%=EventID%>"  type = "hidden">
<table width = "900" border = "0"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center" bgcolor = "DEF6F3">
<tr>
				<td  class = "body2"  colspan = "2" >
					<b>Which classes will they be attending (at least one is required)*:</b>
				</td>
			</tr>
			<tr>
			<td  class = "body2" >&nbsp;
		</td>			
	<td  class = "body2" >
	
	<table width = "900"  align = "center">
	<tr>
	<td class = "body2" width = "350" align = "center"><b>Class</b></td>
	<td class = "body2" width = "200" align = "center"><b>Date & Time</b></td>
	<td class = "body2" width = "50" align = "center"><b>Price</b></td>
	<td class = "body2" align = "center"><b>Instructor</b></td>
	</tr>
	<tr>
<%
'****************************************************************************************************
'  FIND THE Points of Interest
'****************************************************************************************************
i=0
sql = "select * from ClassInfo where EventID = " & EventID  &  ""
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

while Not rs.eof 
i=i +1
ClassInfoID = rs("ClassInfoID")

sql3 = "select * from ClassiNfo where EventID = " & EventID 
'response.write(sql3)
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
if not rs3.eof then 

%>	
<tr >
<td class = "body2" width = "350"><input type="checkbox" name="class<%=i%>" ><%=rs("ClassInfoTitle") %></td>
<td class = "body2" width = "200" align = "center"><%=rs("ClassDateMonth")%>/<%=rs("ClassDateDay")%>/<%=rs("ClassDateYear")%> <%=rs("ClassStartTime")%> - <%=rs("ClassEndTime")%></td>
<td class = "body2" width = "50" align = "center"><% if len(rs("ClassInfoStudentFee")) > 0 then %>
	<%=formatcurrency(rs("ClassInfoStudentFee"))%>
	<% else%>
		Free
		<% end if %>
</td>
<td class = "body2" align = "center"><%=rs("Instructor")%></tr>

<% end if %>

<% rs.movenext
wend
rs.close
%>	
</table>
<br>
</td>
</tr><tr><td  height = "1"><img src = "images/px.gif" width = "1" height = "1"></td></tr>
</table>
<table width = "900" border = "0"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center">
	<tr>
	<td width = "50%">
	   <table>
	      <tr>
			<td class = "body2" align = "right" WIDTH = "150">
					First Name:* &nbsp;
				</td>
				<td class = "body2" align = "left" WIDTH = "300">
					<input name="PeopleFirstName" Value ="<%=PeopleFirstName%>"  size = "33" maxlength = "61">
				</td>
			</tr>
			<tr>
				<td class = "body2" align = "right">
					Last Name:* &nbsp;
				</td>
				<td class = "body2">
					<input name="PeopleLastName" Value ="<%=PeopleLastName%>"  size = "33" maxlength = "61">
				</td>
			</tr>
						<tr>
				<td class = "body2" align = "right">
					Number Attending:* &nbsp;
				</td>
				<td class = "body2">
					<select size="1" name="NumberAttending">
				<% if len(NumberAttending) > 0 then %>
					<option value="<%=NumberAttending%>" selected>NumberAttending</option>
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
				</td>
			</tr>

			
			
			

			
			
			<tr>
				<td   class = "body2" align = "right">
					Email: &nbsp;
				</td>
				<td  align = "left" valign = "top" class = "body2">
					<input name="PeopleEmail"  size = "30" value = "<%=PeopleEmail%>">
				</td>
</tr>
						<tr>
							<td   class = "body2" align = "right">
								Phone: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="PeoplePhone"  size = "30" value = "<%=PeoplePhone%>">
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								Cell: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="PeopleCell"  size = "30" value = "<%=PeopleCell%>">
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								Fax: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="PeopleFax"  size = "30" value = "<%=PeopleFax%>">
							</td>
						</tr>

</table>
</td>
<td width = "50%">
<table>
<tr>
	<td class = "body2" align = "right" width = "200"><small>Amount Paid:</small>
	</td>
	<td class = "body2">
		$<input name="ClassPaidAmount" Value ="<%=ClassPaidAmount%>" class="positive" size = "4" maxlength = "8">

	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>


	 </td>
<tr>	 
<tr>
 <td class = "body2" align = "right"><small>Payment Date:</small>
 </td>
  <td class = "body2">

<select size="1" name="ClassPaidAmountMonth">

		<% if len(ClassPaidAmountMonth) > 0 then %>
					<option value="<%=ClassPaidAmountMonth%>" selected><%=ClassPaidAmountMonth%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

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
				<select size="1" name="ClassPaidAmountDay">
		<% if len(ClassPaidAmountDay) > 0 then %>
					<option value="<%=ClassPaidAmountDay%>" selected><%=ClassPaidAmountDay%></option>
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
		<select size="1" name="ClassPaidAmountYear">
				<% if len(ClassPaidAmountYear) > 0 then %>
					<option value="<%=ClassPaidAmountYear%>" selected><%=ClassPaidAmountYear%></option>
					
					<% if not ClassPaidAmountYear = year(now) then%>
					  <option value="<%=year(now)%>" ><%=year(now)%></option>
					<% end if %>
					
					
				<% else %>
				   <option value="<%=year(now)%>" selected><%=year(now)%></option>
				<% end if %>

					
				
			<% currentyear = year(date) 
						'response.write(currentyear)
					For yearv=currentyear + 1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
		</td>
	   </tr>

<tr>
						  <td   class = "body2" align = "right">
								Mailing Address: &nbsp;
							</td>

							<td  align = "left" valign = "top" class = "body2">
								<input name="AddressStreet"  size = "30" value = "<%=AddressStreet%>">
							</td>
						</tr>
						<tr>
						<td   class = "body2"  align = "right">
								Apartment / Suite: &nbsp;
						</td>
						<td  valign = "top" class = "body2">
								<input name="AddressApt"  size = "30" value = "<%=AddressApt%>">
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								City: &nbsp;
							</td>
							<td  valign = "top" class = "body2">
								<input name="AddressCity"  size = "30" value = "<%=AddressCity%>">
							</td>
						</tr>
						<tr>
							<td  align = "right" class = "body2">
								State/ Provence: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
					
							<select size="1" name="AddressState">
							<% If Len(AddressState) > 0 then%>
								<option value="<%=AddressState%>" selected><%=AddressState%></option>
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
								Postal Code: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="AddressZip"  size = "8" value = "<%=AddressZip%>">
							</td>
						</tr>
</table>
</td>
</tr>
</table>

<table width = "900"  align = "center" border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			<br>
		</td>
	</tr>

<tr><td  align = "center">
<input name="PeopleID" type = "hidden"  value = "<%=PeopleID%>">

	
	<input type=submit value = "Add Student" class = "regsubmit2">
 

</td></tr>
<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			<br>
		</td>
	</tr>


</table>

	</form>
<% end if %>
<br>
<!--#Include file="970Bottom.asp"--><br>


<!--#Include virtual="/Footer.asp"--> 

</Body>
</HTML>