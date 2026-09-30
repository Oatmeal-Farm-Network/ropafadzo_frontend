<%@ Language="VBScript" %> 

<html>
<head>
<!--#Include virtual="GlobalVariables.asp"-->

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<meta name="author" content="Andresen Events">
<link rel="stylesheet" type="text/css" href="Style.css">

<% message=request.querystring("message")%>

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->
<!--#Include virtual="ClassesHeader.asp"-->
<% PageTitleText = "Edit Student"  %>
<!--#Include file="970Top.asp"-->

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "900" align = "center">
	<tr>
		<td Class = "body">
			<% if len(message) > 1 then %>
				<font color="red"><b><%= message %></b></font> 
			<% end if %>	

		</td>
	</tr>
</table>
<% Dim name(2000) 
rowcount = rowcount
%>


<form  name="form" action="ClassesEditStudentHandleForm.asp" method = "post">
<input type = "hidden" name="EventID" value= "<%= EventID %>" >
<table width = "750" border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=0>

<%
row = "odd"
rowcount = 1
row = "even"
rowcount = 1

    PeopleID = request.querystring("PeopleID")
    
 	sql2 = "select  People.*, Address.*, classReg.*, classInfo.* from People, ClassInfo, Classreg, Address where Classreg.PeopleID = People.PeopleID and People.AddressID = Address.AddressID and Classreg.ClassInfoID = ClassInfo.ClassInfoID and ClassInfo.EventID = " & EventID & " and classReg.peopleID = " & PeopleID & " order by Classinfo.EventID Desc"

	'response.write("sql2= " & sql2 & "<br>")
    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3   
	
	if Not rs2.eof then 
	PeopleFirstName = rs2("PeopleFirstName")
	PeopleLastName= rs2("PeopleLastName")
	PeopleEmail= rs2("PeopleEmail")
	PeoplePhone= rs2("PeoplePhone")
	PeopleCell= rs2("PeopleCell")
	PeopleFax= rs2("PeopleFax")
	AddressID = rs2("AddressID")
	'response.write("AddressID=" & AddressID )
	AddressStreet= rs2("AddressStreet")
	AddressApt= rs2("AddressApt")
	AddressCity= rs2("AddressCity")
	AddressState= rs2("AddressState")
	AddressState= rs2("AddressState")
	AddressZip= rs2("AddressZip")
	ClassPaidAmount = rs2("ClassPaidAmount")
	ClassPaidAmountMonth  = rs2("ClassPaidAmountMonth")
	ClassPaidAmountDay = rs2("ClassPaidAmountDay")
	ClassPaidAmountYear = rs2("ClassPaidAmountYear")
NumberAttending = rs2("NumberAttending")

	
	ClassInfoID = rs2("ClassInfoID")
		ClassRegID = rs2("ClassRegID")

 	end if
 
 
 
 
 %>
<br><a name = "<%=ClassRegID%>">
<table width = "900" border = "0"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center" >
<tr>
				<td  class = "body2"  colspan = "2" align = "left">
					Which classes will they be attending:
					<% 'response.write("AddressID=" & AddressID) %>
				</td>
			</tr>
			<tr>
			<td  class = "body2" >&nbsp;
		</td>			
	<td  class = "body2" >
	<table width = "800" bgcolor = "#DEF6F3" align = "center">
	<tr>
	<td class = "body2" width = "200" align = "center"><b>Class</b></td>
	<td class = "body2" width = "200" align = "center"><b>Date & Time</b></td>
	<td class = "body2" align = "center"><b>Instructor<input type="hidden" name="ClassRegID"  value="<%=ClassRegID%>"></b></td>
	<td class = "body2" align = "center"><b>Cost</b></td>
	</tr>
	<tr>
<%
i=0

sql3 = "select distinct * from Classinfo where EventID = " & eventID
'response.write(sql3)
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
while not rs3.eof  
i=i + 1

ClassInfoID = rs3("ClassInfoID")


%>	
<tr>
<td class = "body2" width = "200">

<% classname = "class(" & rowcount & ")" & i
	'response.write("classname =" & classname & "<br>")
	
	
 sql9 = "select * from ClassReg where ClassInfoID = " & ClassInfoID & " and PeopleID = " & PeopleID
'response.write(sql9)
Set rs9 = Server.CreateObject("ADODB.Recordset")
rs9.Open sql9, conn, 3, 3   
if not rs9.eof then

%>
<input type="checkbox" name="<%=classname%>" Checked >
<% else %> 
<input type="checkbox" name="<%=classname%>"  >
<% 
end if 
rs9.close %>

	<input name="ClassInfoID(<%=rowcount%>)" Value ="<%=ClassInfoID%>"  type = "hidden">

	
	<%=rs3("ClassInfoTitle") %></td>
<td class = "body2" width = "200" align = "center"><%=rs3("ClassDateMonth")%>/<%=rs3("ClassDateDay")%>/<%=rs3("ClassDateYear")%> <%=rs3("ClassStartTime")%> <%=rs3("ClassEndTime")%></td>
<td class = "body2" align = "center"><%=rs3("Instructor")%></td>
<td class = "body2" align = "right"><%=formatcurrency(rs3("ClassInfoStudentFee"))%><img src = "images/px.gif" width = "18" height = "1"</td>

</tr>


<% rs3.movenext
wend
numclasses = rs3.recordcount
rs3.close
%>	
</table>
</td>
</tr>
</table>

<input type = "hidden" name="TotalCount" value= "<%= numclasses %>" >





<table width = "900" border = "0"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center" >
	<tr>
	<td width = "50%">
	   <table>
	      <tr>
			<td class = "body2" align = "right" WIDTH = "150">
					First Name:* &nbsp;
				</td>
				<td class = "body2" align = "left" WIDTH = "300">
				<input name="ClassRegID(<%=rowcount%>)" Value ="<%=ClassRegID%>"  type = "hidden">
			

					<input name="PeopleFirstName(<%=rowcount%>)" Value ="<%=PeopleFirstName%>"  size = "33" maxlength = "61">
				</td>
			</tr>
			<tr>
				<td class = "body2" align = "right">
					Last Name:* &nbsp;
				</td>
				<td class = "body2">
					<input name="PeopleLastName(<%=rowcount%>)" Value ="<%=PeopleLastName%>"  size = "33" maxlength = "61">
				</td>
			</tr>
									<tr>
				<td class = "body2" align = "right">
					Number Attending:* &nbsp;
				</td>
				<td class = "body2">
					<select size="1" name="NumberAttending(<%=rowcount%>)">
				<% if len(NumberAttending) > 0 then %>
					<option value="<%=NumberAttending%>" selected><%=NumberAttending%></option>
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
					<input name="PeopleEmail(<%=rowcount%>)"  size = "30" value = "<%=PeopleEmail%>">
				</td>
</tr>
						<tr>
							<td   class = "body2" align = "right">
								Phone: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="PeoplePhone(<%=rowcount%>)"  size = "30" value = "<%=PeoplePhone%>">
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								Cell: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="PeopleCell(<%=rowcount%>)"  size = "30" value = "<%=PeopleCell%>">
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								Fax: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="PeopleFax(<%=rowcount%>)"  size = "30" value = "<%=PeopleFax%>">
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
		$<input name="ClassPaidAmount(<%=rowcount%>)" Value ="<%=ClassPaidAmount%>" class="positive" size = "4" maxlength = "8">

	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>


	 </td>
</tr>	 
<tr>
 <td class = "body2" align = "right"><small>Payment Date:</small>
 </td>
  <td class = "body2">

<select size="1" name="ClassPaidAmountMonth(<%=rowcount%>)">

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
				<select size="1" name="ClassPaidAmountDay(<%=rowcount%>)">
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
		<select size="1" name="ClassPaidAmountYear(<%=rowcount%>)">
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
<table>


<tr>
						  <td   class = "body2" align = "right">
								Mailing Address: &nbsp;
							</td>

							<td  align = "left" valign = "top" class = "body2">
								<input name="AddressStreet(<%=rowcount%>)"  size = "30" value = "<%=AddressStreet%>">
							</td>
						</tr>
						<tr>
						<td   class = "body2"  align = "right">
								Apartment / Suite: &nbsp;
						</td>
						<td  valign = "top" class = "body2">
								<input name="AddressApt(<%=rowcount%>)"  size = "30" value = "<%=AddressApt%>">
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								City: &nbsp;
							</td>
							<td  valign = "top" class = "body2">
								<input name="AddressCity(<%=rowcount%>)"  size = "30" value = "<%=AddressCity%>">
							</td>
						</tr>
						<tr>
							<td  align = "right" class = "body2">
								State/ Provence: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
					
							<select size="1" name="AddressState(<%=rowcount%>)">
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
								<input name="AddressZip(<%=rowcount%>)"  size = "8" value = "<%=AddressZip%>">
								<input name="PeopleID" type = "hidden"  value = "<%=PeopleID%>">
								

							</td>
						</tr>
						
						<% showdelete = false
						if showdelete = True then %>
						<tr><td>&nbsp;</td><td bgcolor = "brown" class = "body" ><input TYPE="checkbox" name="Delete(<%=rowcount%>)" Value = "Yes" ><font color = "white">Delete This Student</font></td></tr>
						<% end if %>


</table>
</td>
</tr>
</table>

<tr><td colspan = "4" align = "center">
<input name="AddressID(<%=rowcount%>)" type = "hidden"  value = "<%=AddressID%>">
<input name="Action" Value ="Update"  type = "hidden">	
	<input type=submit value = "update" class = "regsubmit2">
</td></tr></table>
</form>

<!--#Include file="970Bottom.asp"-->
<!--#Include virtual="/Footer.asp"--> 

</Body>
</HTML>