<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
<!--#Include virtual="GlobalVariables.asp"-->
 <title>Delete a Class</title>
<link rel="stylesheet" type="text/css" href="style.css">

</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include file="Header.asp"-->
<!--#Include file="ClassesHeader.asp"-->
<%  
PeopleID = request.querystring("PeopleID")
EventID = request.querystring("EventID") %>


<br>
<table border = "0" bordercolor = "#DBF5F3" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "700" align = "center" >
<tr>
 <td class = "body2" colspan  "2"><big><b>Delete Student</b></big><br>
</td>
 </tr>
 <tr><td class = "body2" colspan  "3" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<tr><td class = "body2" colspan  "3" height = "1"><b>Are you sure that you want to delete the following student?</b></td></tr>
</table>


<%
row = "odd"
rowcount = 1
row = "even"
rowcount = 1

    PeopleID = request.querystring("PeopleID")
    
 	sql2 = "select  People.*, Address.* from People, Address where  People.AddressID = Address.AddressID and People.peopleID = " & PeopleID 

	'response.write("sql2= " & sql2 & "<br>")
    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3   
	
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

 %>

<table width = "700" border = "0"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center" >
	<tr>
	<td width = "50%">
	   <table>
	      <tr>
			<td class = "body2" align = "right" WIDTH = "150">
					First Name:
				</td>
				<td class = "body2" align = "left" WIDTH = "300">
<%=PeopleFirstName%>
				</td>
			</tr>
			<tr>
				<td class = "body2" align = "right">
					Last Name:
				</td>
				<td class = "body2">
					<%=PeopleLastName%>
				</td>
			</tr>
									
			<tr>
				<td   class = "body2" align = "right">
					Email: &nbsp;
				</td>
				<td  align = "left" valign = "top" class = "body2">
					<%=PeopleEmail%>
				</td>
</tr>
						<tr>
							<td   class = "body2" align = "right">
								Phone: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=PeoplePhone%>
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								Cell: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=PeopleCell%>
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								Fax: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=PeopleFax%>
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
<%=ClassPaidAmount%>

	 </td>
</tr>	 
<tr>
 <td class = "body2" align = "right"><small>Payment Date:</small>
 </td>
  <td class = "body2">

<%=ClassPaidAmountMonth%>
<%=ClassPaidAmountDay%>

<%=ClassPaidAmountYear%>
		</td>
	   </tr>
<table>


<tr>
						  <td   class = "body2" align = "right">
								Mailing Address: &nbsp;
							</td>

							<td  align = "left" valign = "top" class = "body2">
								<%=AddressStreet%>
							</td>
						</tr>
						<tr>
						<td   class = "body2"  align = "right">
								Apartment / Suite: &nbsp;
						</td>
						<td  valign = "top" class = "body2">
								<%=AddressApt%>
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								City: &nbsp;
							</td>
							<td  valign = "top" class = "body2">
								<%=AddressCity%>
							</td>
						</tr>
						<tr>
							<td  align = "right" class = "body2">
								State/ Provence: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
<%=AddressState%>
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								Postal Code: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=AddressZip%>
								

							</td>
						</tr>


</table>

</td>
</tr>
 <tr><td class = "body2" colspan = "3" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
</table>



<br>
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "200" align = "center">
<tr>
<td>
<form  name=form method="post" action="StudentsEdit.asp?EventID=<%=eventID%>">
      <input type="Submit" value="Cancel" class = "regsubmit2">
</form>

</td>
<td align = "left">
<form  name=form method="post" action="ClassesStudentDelete.asp?PeopleID=<%=PeopleID%>&EventID=<%=EventID%>">
               
		<input type="Submit" value="Delete" class = "regsubmit2">

	</form>


</td>
</tr>
</table>




</Body>
</HTML>