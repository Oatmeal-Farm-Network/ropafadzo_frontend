<%	
	option explicit 
	Response.Buffer = True
%>
<%
'@BEGINVERSIONINFO

'@APPVERSION: 50.3007.0.1

'@FILENAME: mailsubscribe.asp
 
'

'@DESCRIPTION: Allows Customer to Subscribe to Merchant Mailing List

'@STARTCOPYRIGHT
'The contents of this file is protected under the United States
'copyright laws and is confidential and proprietary to
'LaGarde, Incorporated.  Its use or disclosure in whole or in part without the
'expressed written permission of LaGarde, Incorporated is expressly prohibited.
'
'(c) Copyright 2000, 2001 by LaGarde, Incorporated.  All rights reserved.
'@ENDCOPYRIGHT

'@ENDVERSIONINFO
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>Join Mailing List</title>
<meta name="GENERATOR" content="Microsoft FrontPage 5.0">
<meta name="ProgId" content="FrontPage.Editor.Document">
<SCRIPT ID=clientEventHandlersJS LANGUAGE=javascript>
<!--

function form1_onsubmit() {
			                
                            if (form1.fname.value == "") {
                            alert("Must Fill in User Name");
                            form1.fname.focus()
                            return false; }
                           if (form1.lName.value == "") {
                            alert("Must Fill in Last Name");
                            form1.lName.focus()
                            return false; }
                           if (form1.password.value == "") {
                            alert("Must supply a password");
                            form1.password.focus()
                            return false; }
                            if (form1.password2.value == "") {
                            alert("Must supply a matching password confirmation");
                            form1.password2.focus()
                            return false; } 
                          if (form1.password.value != form1.password2.value) {
                            alert("Password and Password Confirmation Did Not Match");
                            form1.password.focus()
                            return false; }
                           if (form1.emailadd.value == "") {
                            alert("Must Fill in Email Address");
                            form1.emailadd.focus()
                            return false; }  
                           
                       }
//-->
</SCRIPT>
</head>
<!--#include file="SFLib/db.conn.open.asp"-->
<!--#include file="SFLib/adovbs.inc"-->
<!--#include file="sfLib/incDesign.asp"-->
<!--#include file="SFLib/incGeneral.asp"-->
<body background="<%= C_BKGRND %>" bgproperties="fixed" bgcolor="<%= C_BGCOLOR %>" link="<%= C_LINK %>" vlink="<%= C_VLINK %>" alink="<%= C_ALINK %>">
<%
	Dim rsCust, sFirstName, sLastName,sPassword,sConfirmPass,sEmail, sSql
	sEmail         = Trim(Request.Form("emailadd"))
	If  semail <> "" then	
		sFirstName		= Trim(Request.Form("fname"))
		sLastName		= Trim(Request.Form("lname"))
		sPassword		= Trim(Request.Form("password"))
		sConfirmPass   = Trim(Request.Form("passwordconfirm"))
		
	
		Set rsCust = Server.CreateObject("ADODB.RecordSet")			
	sSql="Select * From sfCustomers where custEmail = " & "'" & sEmail & "'"
		rsCust.Open  sSql , cnn, adOpenKeyset, adLockOptimistic, adCmdText
   if rsCust.EOF =false and rsCust.BOF =false then
	   
	   	    	'rsCust.Fields("custFirstName")		= sfirstname
		    	'rsCust.Fields("custLastName")		= slastName
			    rsCust.Fields("custPasswd")	        = spassword
			    rsCust.Fields("custIsSubscribed")	= 1
		        rsCust.Update 
                  
     
         
    else
    closeObj(rsCust)
     	 sSql = " Select * from sfCustomers " 
     	
     			rsCust.Open sSql , cnn, adOpenKeyset, adLockOptimistic, adCmdText

            rsCust.AddNew 
               rsCust.Fields("custFirstName")		= sfirstname
		    	rsCust.Fields("custLastName")		= slastName
			    rsCust.Fields("custPasswd")	        = spassword
			    rsCust.Fields("custEmail")	= sEmail
			     rsCust.Fields("custLastAccess") = Date()
			    rsCust.Fields("custIsSubscribed")	= 1
		        rsCust.Update
		end if         
		closeObj(rsCust)
	Else
		closeObj(rsCust)
		sfirstname		=""
		slastname = ""
		spassword      ="" 
		sconfirmpass=""
		sEmail =""
	End If	
%>
	<table border="0" cellpadding="1" cellspacing="0" bgcolor="<%= C_BORDERCOLOR1 %>" width="<%= C_WIDTH %>" align="center">
      <tr>
        <td>
	      <form method="post" action="mailsubscribe.asp"  id="form1" name="form1" LANGUAGE=javascript onsubmit="return form1_onsubmit()">
  
            <table width="100%" border="0" cellspacing="1" cellpadding="3">
              <tr>
                <%	If C_BNRBKGRND = "" Then %>
		        <td align="middle" background="<%= C_BKGRND1 %>" bgcolor="<%= C_BGCOLOR1 %>"><b><font face="<%= C_FONTFACE1 %>" color="<%= C_FONTCOLOR1 %>" SIZE="<%= C_FONTSIZE1 %>"><%= C_STORENAME %></font></b></td>
                <%	Else %>
		        <td align="middle" bgcolor="<%= C_BNRBGCOLOR %>"><img src="<%= C_BNRBKGRND %>" border="0"></td>
                <%	End If %>      
              </tr>
              <tr>
	            <td align="middle" background="<%= C_BKGRND2 %>" bgcolor="<%= C_BGCOLOR2 %>"><b><font face="<%= C_FONTFACE2 %>" color="<%= C_FONTCOLOR2 %>" SIZE="<%= C_FONTSIZE2 %>">Mailing List</font></b></td>        
              </tr>
              <tr>
                <td bgcolor="<%= C_BGCOLOR3 %>" background="<%= C_BKGRND3 %>"><font face="<%= C_FONTFACE3 %>" color="<%= C_FONTCOLOR3 %>" size="<%= C_FONTSIZE3 %>">Complete
                  the form below to subscribe to our mailing list.&nbsp;
                  Subscribers will be able to receive store newsletters, sale
                  announcements and other mailings of interest.</font></td>
              </tr>
              <tr>
                <td bgcolor="<%= C_BGCOLOR4 %>" background="<%= C_BKGRND4 %>" width="100%" nowrap>
                  <table border="0" width="100%" cellpadding="4" cellspacing="0">        
                    <% If sEmail <> "" Then %>
                    <tr>
                      <td width="100%" colspan="2" align="center" height="90" valign="center">
			            <table width="60%" cellpadding="1" cellspacing="0" bgcolor="<%= C_BORDERCOLOR1 %>">
			              <tr><td width="100%">
				              <table cellpadding="5" cellspacing="0" bgcolor="<%= C_BGCOLOR4 %>" width="100%">
				                <tr><td width="100%" bgcolor="<%= C_BGCOLOR4 %>" align="center" background="<%= C_BKGRND5 %>">
				                    <b><font face="<%= C_FONTFACE5 %>" color="#992222" size="<%= C_FONTSIZE5+2 %>"><b>You have Been added to the Mailing List
				                    </font>
				                    
				                  </td></tr>
				              </table>
			                </td></tr>	
			            </table>
                      </td>
                    </tr>
		            <% End If %>
                    
                    <tr>
                      <td width="40%" align="right"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 %>">First Name:</font></td>
                      <td width="60%"><input type="text" value="<%= sFirstname %>" name="fname" size="40" style="<%= C_FORMDESIGN %>"></td>
                    </tr>
                    <tr>
                      <td width="40%" align="right" valign="top"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 %>">Last Name :</font></td>
                      <td width="60%"><input type="text" value="<%= slastname %>" name="lName" size="40" style="<%= C_FORMDESIGN %>">
                      </td>
                    </tr>
                    <tr>
                      <td width="40%" align="right"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 %>">Password:</font></td>
                      <td width="60%"><input type="password" value="<%= spassword %>" name="password" size="40" style="<%= C_FORMDESIGN %>"></td>
                    </tr>
                    <tr>
                      <td width="40%" align="right"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 %>">Confirm Password:</font></td>
                      <td width="60%"><input type="password" value="<%= sconfirmpass %>" name="password2" size="40" style="<%= C_FORMDESIGN %>"></td>
                    </tr>
                    <tr>
                      <td width="40%" align="right" valign="top"><font face="<%= C_FONTFACE4 %>" color="<%= C_FONTCOLOR4 %>" size="<%= C_FONTSIZE4 %>">E-Mail Address:</font></td>
                      <td width="60%"><input type="text" value="<%= sEmail %>" name="emailadd" size="40" style="<%= C_FORMDESIGN %>">
                      </td>
                    </tr>
                    <tr>
                      <td width="100%" align="center" valign="top" colspan="2"><input type="image" name="Submit" border="0" src="<%= C_BTN18 %>" ></td>
                    </tr>     
                  </table>
		        </form>
	          </td>
	        </tr>
              <!--#include file="footer.txt"-->
          </table>
        </td>
      </tr>
</table>
</body>
</html>
<%
closeObj(cnn)
%>



